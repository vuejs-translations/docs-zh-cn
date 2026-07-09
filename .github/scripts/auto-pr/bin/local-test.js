#!/usr/bin/env node

import { execFileSync } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { ROOT } from "../src/helpers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STAGE_SCRIPT = resolve(__dirname, "stage.js");
const STAGES = ["prepare", "translate", "submit"];

function parseArg(argv, name) {
  const idx = argv.indexOf(name);
  return idx === -1 ? null : argv[idx + 1] || null;
}

function parseStages(value) {
  if (!value || value === "all") return STAGES;

  const selected = value.split(",").map((item) => item.trim());
  const invalid = selected.filter((stage) => !STAGES.includes(stage));
  if (invalid.length > 0) {
    console.error(`Invalid stage: ${invalid.join(", ")}. Valid: ${STAGES.join(", ")} or all`);
    process.exit(1);
  }

  return selected;
}

const args = process.argv.slice(2);
const selectedStages = parseStages(parseArg(args, "--stage") || "all");
const provider = parseArg(args, "--provider") || process.env.TRANSLATE_PROVIDER || "claude";

const env = {
  ...process.env,
  LOCAL: "true",
  UPSTREAM_REPO: process.env.UPSTREAM_REPO || "vuejs/docs",
  UPSTREAM_BRANCH: process.env.UPSTREAM_BRANCH || "upstream",
  SYNC_BRANCH: process.env.SYNC_BRANCH || "sync",
  TARGET_BRANCH: process.env.TARGET_BRANCH || "main",
  TRANSLATE_PROVIDER: provider,
  SKIP_TRANSLATE_GATE: process.env.SKIP_TRANSLATE_GATE || "false",
};

const sep = "=".repeat(72);
console.log(`\n${sep}`);
console.log("  Auto-PR local test");
console.log(`  stages: ${selectedStages.join(", ")}`);
console.log(`  provider: ${provider}`);
console.log(`${sep}\n`);

for (const stage of selectedStages) {
  console.log(`\n${sep}`);
  console.log(`  stage: ${stage}`);
  console.log(`  ${new Date().toLocaleString()}`);
  console.log(`${sep}\n`);

  execFileSync(process.execPath, [STAGE_SCRIPT, stage], {
    cwd: ROOT,
    env,
    stdio: "inherit",
  });
}

console.log(`\n${sep}`);
console.log("  local test complete");
console.log(`${sep}\n`);
