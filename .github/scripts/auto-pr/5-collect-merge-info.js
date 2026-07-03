import { execSync } from "child_process";
import { readFileSync, appendFileSync, existsSync } from "fs";

const {
  MERGE_STATUS,
  DETECT_CHANGED_FILES,
  GITHUB_OUTPUT,
} = process.env;

function setOutput(key, value) {
  if (GITHUB_OUTPUT) {
    appendFileSync(GITHUB_OUTPUT, `${key}=${value}\n`);
  }
  if (process.env.LOCAL) {
    console.log(`[local] ${key}=${value}`);
  }
}

// ── merge_result & conflict_files ──
if (MERGE_STATUS === "conflict") {
  setOutput("merge_result", "conflict");

  const todoPath = ".github/scripts/auto-pr/todo-translation.json";
  if (existsSync(todoPath)) {
    const items = JSON.parse(readFileSync(todoPath, "utf-8"));
    const files = [...new Set(items.map((i) => i.file))];
    setOutput("conflict_files", files.join(","));
  } else {
    setOutput("conflict_files", "");
  }
} else {
  setOutput("merge_result", "clean");
  setOutput("conflict_files", "");
}

// ── changed_files ──
let changedFiles;
try {
  changedFiles = execSync("git diff --name-only HEAD -- 'src/**/*.md'", {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "ignore"],
  })
    .trim()
    .split("\n")
    .filter(Boolean)
    .join(",");
} catch {
  changedFiles = "";
}

if (!changedFiles) {
  changedFiles = DETECT_CHANGED_FILES || "";
}

setOutput("changed_files", changedFiles);
