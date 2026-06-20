import { execFileSync } from "child_process";
import { readFileSync, writeFileSync, appendFileSync } from "fs";

const BASE = ".github/scripts/auto-pr";

/**
 * Tip: 当 json 减少时候，作为一个文件，翻译，翻译任务多时候，使用 item 模式去翻译，这样更精准，因为 json 过大会导致质量差
 * Mode: "all" = one call for everything, "file" = one call per file, "item" = one call per item
 * */
const MODE = process.env.TRANSLATE_MODE || "all";

function setOutput(key, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    appendFileSync(outputFile, `${key}=${value}\n`);
  }
}

// Load todo list from merge job
const todo = JSON.parse(readFileSync(`${BASE}/todo-translation.json`, "utf-8"));

if (todo.length === 0) {
  console.log("No items to translate.");
  setOutput("translate_status", "skipped");
  process.exit(0);
}

console.log(`Mode: ${MODE}`);

// Load prompt template and translation conventions (once)
const promptTemplate = readFileSync(`${BASE}/translation-prompt.md`, "utf-8");
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

const basePrompt = promptTemplate
  .replace("{{TERMINOLOGY}}", terminology)
  .replace("{{FORMATTING}}", formatting)
  .replace("{{GUIDELINES}}", guidelines);

// Group items by file
const byFile = {};
for (const item of todo) {
  (byFile[item.file] ??= []).push(item);
}

// Separate items that need translation from those already identical
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

// Identical items always skip
for (const item of identical) {
  skipped++;
  done.push({ ...item, review: item.current });
}

function callCopilot(items) {
  const itemsJson = JSON.stringify(items, null, 2);
  const prompt = basePrompt.replace("{{ITEMS}}", itemsJson);

  const result = execFileSync("copilot", ["-p", prompt, "--allow-all", "-s"], {
    encoding: "utf-8",
    env: { ...process.env },
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 120_000,
  }).trim();

  const jsonStr = result.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  const reviewed = JSON.parse(jsonStr);

  if (!Array.isArray(reviewed) || reviewed.length !== items.length) {
    throw new Error(
      `Expected array of ${items.length}, got ${Array.isArray(reviewed) ? reviewed.length : typeof reviewed}`,
    );
  }

  return reviewed;
}

try {
  if (toTranslate.length > 0) {
    if (MODE === "all") {
      // One call for all items
      const reviewed = callCopilot(toTranslate);
      for (const item of reviewed) {
        translated++;
        done.push(item);
      }
      console.log(`✓ ${translated} items translated in 1 call`);
    } else if (MODE === "file") {
      // One call per file
      const byFileTranslate = {};
      for (const item of toTranslate) {
        (byFileTranslate[item.file] ??= []).push(item);
      }

      for (const [file, items] of Object.entries(byFileTranslate)) {
        console.log(`\n📄 ${file} (${items.length} items)`);
        const reviewed = callCopilot(items);
        for (const item of reviewed) {
          translated++;
          done.push(item);
          console.log(`  lines ${item.lines.join("-")} ✓`);
        }
      }
    } else {
      // One call per item
      for (const item of toTranslate) {
        console.log(`  lines ${item.lines.join("-")}`);
        const reviewed = callCopilot([item]);
        translated++;
        done.push(reviewed[0]);
        console.log(`    ✓ translated`);
      }
    }
  }
} catch (err) {
  console.error(`\n❌ Translation failed: ${err.message}`);
  setOutput("translate_status", "failed");
  console.timeEnd("Translation_times");
  process.exit(1);
}

writeFileSync(`${BASE}/done-translation.json`, JSON.stringify(done, null, 2), "utf-8");

console.log(
  `\n✅ Done: ${translated} translated, ${skipped} skipped → ${BASE}/done-translation.json`,
);

console.timeEnd("Translation_times");
setOutput("translate_status", "success");

