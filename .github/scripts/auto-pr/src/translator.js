import { execFile, spawn } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { AUTO_PR_DIR, setOutput } from "./helpers.js";

const TODO_PATH = resolve(AUTO_PR_DIR, "todo-translation.json");
const DONE_PATH = resolve(AUTO_PR_DIR, "done-translation.json");
const PROMPT_PATH = resolve(AUTO_PR_DIR, "prompts", "translation.md");
const BATCH_SIZE = 20; // 每批 20 个items，避免 prompt 太长导致 AI 处理失败

const PROVIDERS = {
  copilot: {
    command: "copilot",
    args: (prompt) => ["-p", prompt, "--allow-all", "-s"],
  },
  claude: {
    command: "claude",
    args: () => [
      "-p",
      "--tools",
      "",
      "--system-prompt",
      "You are a JSON generator. Return valid JSON data based on the prompt provided. No Markdown, no explanations, no extra text. Use double quotes, no trailing commas.",
    ],
    stdin: true,
  },
};

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function readPromptTemplate() {
  const [promptTemplate, terminology, formatting, guidelines] = await Promise.all([
    readFile(PROMPT_PATH, "utf-8"),
    readFile(".claude/skills/vuejs-docs-zh-cn/references/terminology.md", "utf-8"),
    readFile(".claude/skills/vuejs-docs-zh-cn/references/formatting.md", "utf-8"),
    readFile(".claude/skills/vuejs-docs-zh-cn/references/guidelines.md", "utf-8"),
  ]);

  return promptTemplate
    .replace("{{TERMINOLOGY}}", terminology)
    .replace("{{FORMATTING}}", formatting)
    .replace("{{GUIDELINES}}", guidelines);
}

/**
 * AI 返回的结果不稳定，常见问题：
 * - 被 ```json 或 ``` 包裹（由 parseJsonResult 处理）
 * - 非法 JSON 转义（如 \`）
 * - 字面控制字符（CR/LF 嵌入字符串值）
 * - 字符串内未转义的 ASCII 双引号（如 "最高级别"）
 */
function sanitizeAndParse(text) {
  // 第 1 层：标准解析
  try {
    return JSON.parse(text);
  } catch (originalError) {
    // 第 2 层：修复非法转义 + 清理字面控制字符
    let cleaned = text
      .replace(/\\([^"\\/bfnrtu])/g, "$1") // \X → X
      .replace(/\r/g, "") // 去掉字面 CR
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""); // 去掉其他控制字符
    try {
      return JSON.parse(cleaned);
    } catch {
      // 第 3 层：修复字符串值内未转义的 ASCII 双引号
      const repaired = repairJsonQuotes(cleaned);
      try {
        return JSON.parse(repaired);
      } catch {
        throw originalError; // 抛原始错误，保留定位信息
      }
    }
  }
}

/**
 * 修复 JSON 字符串值中未转义的 ASCII 双引号。
 *
 * AI 常写出这样的 JSON：
 *   "review": "他说"好的"然后走了。"
 * 这里的 "好的" 中的 " 应该转义为 \"。
 *
 * 策略：状态机逐字符扫描，跟踪 inString 状态。
 * 在字符串内部遇到未转义的 " 时：
 *   - 如果下一个非空白字符是 , ] } : → 结构性的结束引号，不动
 *   - 否则（前一个字符是 CJK）→ 内容引号，补上 \ 转义
 */
function repairJsonQuotes(text) {
  const CJK = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;
  let result = "";
  let inString = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    // 字符串内的转义序列：\ 和后一个字符原样保留
    if (ch === "\\" && inString) {
      result += ch;
      if (i + 1 < text.length) {
        i++;
        result += text[i];
      }
      continue;
    }

    if (ch === '"') {
      if (!inString) {
        inString = true;
      } else {
        // 找下一个非空白字符，判断是否为结构性结束符
        let nextNonWs = "";
        for (let j = i + 1; j < text.length; j++) {
          const c = text[j];
          if (c !== " " && c !== "\t" && c !== "\n") {
            nextNonWs = c;
            break;
          }
        }
        const isStructural =
          nextNonWs === "," || nextNonWs === "]" || nextNonWs === "}" || nextNonWs === ":";
        const prevIsCJK = i > 0 && CJK.test(text[i - 1]);

        if (isStructural) {
          inString = false; // 真正的结束引号
        } else if (prevIsCJK) {
          // CJK 上下文中的内容引号 → 转义
          result += '\\"';
          continue;
        }
      }
    }

    result += ch;
  }

  return result;
}

async function parseJsonResult(result) {
  try {
    return sanitizeAndParse(result);
  } catch {
    // Try extracting from ```json ... ``` or ``` ... ``` block
    // Use greedy match first (handles ``` inside string values)
    const codeMatch = result.match(/```(?:json)?\s*([\s\S]*)\s*```/);
    if (codeMatch) {
      try {
        return sanitizeAndParse(codeMatch[1].trim());
      } catch {
        // If greedy fails (e.g. trailing text after closing ```), try lazy
        const lazyMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (lazyMatch) {
          return sanitizeAndParse(lazyMatch[1].trim());
        }
      }
    }
    // Last resort: extract content between first [ and last ]
    const arrayMatch = result.match(/\[\s*[\s\S]*\]/);
    if (arrayMatch) {
      return sanitizeAndParse(arrayMatch[0]);
    }
    throw new Error("Failed to parse JSON result from AI response");
  }
}

async function callProvider(providerName, basePrompt, items) {
  const provider = PROVIDERS[providerName];
  if (!provider) {
    throw new Error(
      `Unsupported TRANSLATE_PROVIDER: ${providerName}. Expected one of: ${Object.keys(PROVIDERS).join(", ")}`,
    );
  }

  const itemsJsonStr = JSON.stringify(items, null, 2);
  const fullPrompt = basePrompt.replace("{{ITEMS}}", itemsJsonStr);

  let result;
  if (provider.stdin) {
    // Pipe prompt via stdin to avoid Windows CLI length limit (ENAMETOOLONG)

    try {
      const child = spawn(provider.command, provider.args(), {
        encoding: "utf-8",
        env: { ...process.env },
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 1200_000,
      });

      // 通过 stdin 写入大数据
      child.stdin.write(fullPrompt);
      child.stdin.end();

      // 收集输出
      let stdout = "";
      child.stdout.on("data", (data) => {
        stdout += data;
      });

      await new Promise((resolve, reject) => {
        child.on("close", (code) => {
          if (code === 0) resolve(stdout.trim());
          else reject(new Error(`Exit code: ${code}`));
        });
        child.on("error", reject);
      });

      result = stdout;
    } catch (e) {
      throw new Error(`${provider.command} failed (exit code: ${e.status})`);
    }
  } else {
    // TODO 需要验证 copilot 本地是否有效，为了避免因为 本地 copilot 导致 云上失败，暂时不动，需要验证
    result = await new Promise((resolve, reject) => {
      execFile(
        provider.command,
        provider.args(fullPrompt),
        {
          encoding: "utf-8",
          env: { ...process.env },
          stdio: ["pipe", "pipe", "pipe"],
          timeout: 1200_000,
        },
        (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout.trim());
        },
      );
    });
  }

  // 处理 ai 返回的不稳定数据结构，包含转义符等
  const reviewed = await parseJsonResult(result);

  if (!Array.isArray(reviewed)) {
    throw new Error(`Expected array, got ${typeof reviewed}`);
  }

  if (reviewed.length !== items.length) {
    console.error(`[warn] 长度不匹配: 期望 ${items.length}, 实际 ${reviewed.length}, 已自动修正`);
    if (reviewed.length > items.length) {
      reviewed.splice(items.length);
    } else {
      while (reviewed.length < items.length) {
        reviewed.push({ ...items[reviewed.length], review: "" });
      }
    }
  }

  return reviewed;
}

export async function translateConflicts({
  provider = process.env.TRANSLATE_PROVIDER || "copilot",
} = {}) {
  const todo = JSON.parse(await readFile(TODO_PATH, "utf-8"));

  if (todo.length === 0) {
    console.log("No items to translate.");
    setOutput("translate_status", "skipped");
    return {
      status: "skipped",
      provider,
      translated: 0,
      skipped: 0,
    };
  }

  console.log(`Provider: ${provider}`);

  console.time("readPromptTemplate");

  const basePrompt = await readPromptTemplate();
  const toTranslate = [];
  const identical = [];

  console.timeEnd("readPromptTemplate");

  for (const item of todo) {
    if (item.incoming === item.current) {
      identical.push(item);
    } else {
      toTranslate.push(item);
    }
  }

  console.time("Translation_times");
  console.log(
    `Total: ${todo.length}, toTranslate: ${toTranslate.length}, identical: ${identical.length}`,
  );

  const done = [];
  let translated = 0;
  let skipped = 0;

  for (const item of identical) {
    skipped++;
    done.push({ ...item, review: item.current });
  }

  let status = "success";
  let hasFailure = false;

  try {
    if (toTranslate.length > 0) {
      const batches = chunkArray(toTranslate, BATCH_SIZE);
      console.log(
        `Translating ${toTranslate.length} items in ${batches.length} batch(es) of ${BATCH_SIZE} concurrently...`,
      );

      const results = await Promise.allSettled(
        batches.map((batch, i) => {
          console.log(`  Batch ${i + 1}/${batches.length}: ${batch.length} items`);
          return callProvider(provider, basePrompt, batch);
        }),
      );

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status === "fulfilled") {
          for (const item of result.value) {
            translated++;
            done.push(item);
          }
        } else {
          hasFailure = true;
          const failedItems = batches[i];
          console.error(
            `  Batch ${i + 1}/${batches.length} failed: ${result.reason?.message || "unknown error"}`,
          );
          // Fallback: use incoming as review for failed batch items
          for (const item of failedItems) {
            translated++;
            done.push({ ...item, review: item.incoming });
          }
        }
      }

      status = hasFailure ? "partial_failure" : "success";
      console.log(`\n${translated} items translated (${status})`);
    }
  } catch (err) {
    // Only top-level unexpected errors reach here (e.g. prompt template load failure)
    console.error(`\nTranslation failed: ${err.message}`);
    setOutput("translate_status", "failed");
    throw err;
  } finally {
    console.timeEnd("Translation_times");
  }

  await writeFile(
    DONE_PATH,
    JSON.stringify(done, ["file", "lines", "current", "incoming", "review"], 2),
    "utf-8",
  );

  console.log(`\nDone: ${translated} translated, ${skipped} skipped -> ${DONE_PATH}`);

  setOutput("translate_status", status);

  return {
    status,
    provider,
    translated,
    skipped,
  };
}
