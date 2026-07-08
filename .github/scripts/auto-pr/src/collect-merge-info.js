import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { AUTO_PR_DIR, ROOT, isDirectRun, setOutput } from "./helpers.js";

const TODO_PATH = resolve(AUTO_PR_DIR, "todo-translation.json");

export function collectMergeInfo({
  mergeStatus = process.env.MERGE_STATUS,
  detectChangedFiles = process.env.DETECT_CHANGED_FILES || "",
} = {}) {
  const result = {};

  // ── merge_result & conflict_files ──
  if (mergeStatus === "conflict") {
    result.merge_result = "conflict";

    if (existsSync(TODO_PATH)) {
      const items = JSON.parse(readFileSync(TODO_PATH, "utf-8"));
      const files = [...new Set(items.map((i) => i.file))];
      result.conflict_files = files.join(",");
    } else {
      result.conflict_files = "";
    }
  } else {
    result.merge_result = "clean";
    result.conflict_files = "";
  }

  // ── changed_files ──
  let changedFiles;
  try {
    changedFiles = execSync("git diff --name-only HEAD -- 'src/**/*.md'", {
      cwd: ROOT,
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
    changedFiles = detectChangedFiles;
  }

  result.changed_files = changedFiles;
  return result;
}

if (isDirectRun(import.meta.url)) {
  const result = collectMergeInfo();
  setOutput("merge_result", result.merge_result);
  setOutput("conflict_files", result.conflict_files);
  setOutput("changed_files", result.changed_files);
}
