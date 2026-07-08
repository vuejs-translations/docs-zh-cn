import { execFileSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { AUTO_PR_DIR, setOutput } from "./helpers.js";

const TODO_PATH = resolve(AUTO_PR_DIR, "todo-translation.json");
const DONE_PATH = resolve(AUTO_PR_DIR, "done-translation.json");
const PROMPT_PATH = resolve(AUTO_PR_DIR, "prompts", "translation.md");

const PROVIDERS = {
  copilot: {
    command: "copilot",
    args: (prompt) => ["-p", prompt, "--allow-all", "-s"],
  },
  claude: {
    command: "claude",
    args: (prompt) => ["-p", prompt],
  },
};

function readPromptTemplate() {
  const promptTemplate = readFileSync(PROMPT_PATH, "utf-8");
  const terminology = readFileSync(
    ".claude/skills/vuejs-docs-zh-cn/references/terminology.md",
    "utf-8",
  );
  const formatting = readFileSync(
    ".claude/skills/vuejs-docs-zh-cn/references/formatting.md",
    "utf-8",
  );
  const guidelines = readFileSync(
    ".claude/skills/vuejs-docs-zh-cn/references/guidelines.md",
    "utf-8",
  );

  return promptTemplate
    .replace("{{TERMINOLOGY}}", terminology)
    .replace("{{FORMATTING}}", formatting)
    .replace("{{GUIDELINES}}", guidelines);
}

function parseJsonResult(result) {
  const jsonStr = result.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  return JSON.parse(jsonStr);
}

function callProvider(providerName, basePrompt, items) {
  const provider = PROVIDERS[providerName];
  if (!provider) {
    throw new Error(
      `Unsupported TRANSLATE_PROVIDER: ${providerName}. Expected one of: ${Object.keys(PROVIDERS).join(", ")}`,
    );
  }

  const itemsJson = JSON.stringify(items, null, 2);
  const prompt = basePrompt.replace("{{ITEMS}}", itemsJson);

  const result = execFileSync(provider.command, provider.args(prompt), {
    encoding: "utf-8",
    env: { ...process.env },
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 120_000,
  }).trim();

  const reviewed = parseJsonResult(result);
  if (!Array.isArray(reviewed) || reviewed.length !== items.length) {
    throw new Error(
      `Expected array of ${items.length}, got ${
        Array.isArray(reviewed) ? reviewed.length : typeof reviewed
      }`,
    );
  }

  return reviewed;
}

export function translateConflicts({
  provider = process.env.TRANSLATE_PROVIDER || "copilot",
  mode = process.env.TRANSLATE_MODE || "all",
} = {}) {
  const todo = JSON.parse(readFileSync(TODO_PATH, "utf-8"));

  if (todo.length === 0) {
    console.log("No items to translate.");
    setOutput("translate_status", "skipped");
    return {
      status: "skipped",
      provider,
      mode,
      translated: 0,
      skipped: 0,
    };
  }

  if (!["all", "file", "item"].includes(mode)) {
    throw new Error(`Unsupported TRANSLATE_MODE: ${mode}. Expected all, file, or item.`);
  }

  console.log(`Provider: ${provider}`);
  console.log(`Mode: ${mode}`);

  const basePrompt = readPromptTemplate();
  const toTranslate = [];
  const identical = [];

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

  try {
    if (toTranslate.length > 0) {
      if (mode === "all") {
        const reviewed = callProvider(provider, basePrompt, toTranslate);
        for (const item of reviewed) {
          translated++;
          done.push(item);
        }
        console.log(`${translated} items translated in 1 call`);
      } else if (mode === "file") {
        const byFile = {};
        for (const item of toTranslate) {
          (byFile[item.file] ??= []).push(item);
        }

        for (const [file, items] of Object.entries(byFile)) {
          console.log(`\nFile: ${file} (${items.length} items)`);
          const reviewed = callProvider(provider, basePrompt, items);
          for (const item of reviewed) {
            translated++;
            done.push(item);
            console.log(`  lines ${item.lines.join("-")} translated`);
          }
        }
      } else {
        for (const item of toTranslate) {
          console.log(`  lines ${item.lines.join("-")}`);
          const reviewed = callProvider(provider, basePrompt, [item]);
          translated++;
          done.push(reviewed[0]);
          console.log("    translated");
        }
      }
    }
  } catch (err) {
    console.error(`\nTranslation failed: ${err.message}`);
    setOutput("translate_status", "failed");
    console.timeEnd("Translation_times");
    throw err;
  }

  writeFileSync(DONE_PATH, JSON.stringify(done, null, 2), "utf-8");

  console.log(
    `\nDone: ${translated} translated, ${skipped} skipped -> ${DONE_PATH}`,
  );

  console.timeEnd("Translation_times");
  setOutput("translate_status", "success");

  return {
    status: "success",
    provider,
    mode,
    translated,
    skipped,
  };
}
