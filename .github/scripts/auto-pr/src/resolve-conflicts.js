import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { AUTO_PR_DIR, isDirectRun, readState } from "./helpers.js";

const TODO_PATH = resolve(AUTO_PR_DIR, "todo-translation.json");

// 无脑接受 incoming 的文件列表及其策略
// "markers"  - 解析冲突标记，只替换冲突块，保留非冲突区域（适合 package.json 等），类似 vscode 的 "Accept Incoming Changes" 功能
// "whole"    - git checkout --theirs 整文件替换（适合 lockfile 等损坏标记的文件）
const DEFAULT_ACCEPT_INCOMING_LIST = {
  "pnpm-lock.yaml": "whole",

  // 将会以 accept-incoming-markers 的方式处理，保留非冲突区域，冲突块取 theirs
  "package.json": "markers",
  "**/*.vue": "markers",
  "**/*.ts": "markers",
  "**/*.json": "markers",
};

// 轻量 glob 匹配，支持 * 和 **
function isGlobMatch(file, pattern) {
  const regex = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&") // 转义特殊字符
    .replace(/\*\*/g, "<<GLOBSTAR>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<GLOBSTAR>>/g, ".*");
  return new RegExp(`^${regex}$`).test(file);
}

// 将 markdown 内容按段落拆分，保护代码块内部的空行
function splitIntoParagraphs(content) {
  const lines = content.split("\n");
  const paragraphs = [];
  let start = 0;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    // 检测代码块边界
    if (/^```/.test(lines[i])) {
      inCodeBlock = !inCodeBlock;
    }

    // 空行且不在代码块内 → 段落结束
    if (lines[i].trim() === "" && !inCodeBlock && i > start) {
      // 检查从 start 到 i 是否有非空内容
      if (lines.slice(start, i).some((l) => l.trim())) {
        const text = lines.slice(start, i).join("\n");
        paragraphs.push({
          current: "",
          incoming: text,
          lines: [start + 1, i], // 1-based 行号
        });
      }
      start = i + 1;
    }
  }

  // 最后一段
  if (start < lines.length) {
    const text = lines.slice(start).join("\n");
    paragraphs.push({
      current: "",
      incoming: text,
      lines: [start + 1, lines.length],
    });
  }

  return paragraphs;
}

class GitConflictFinder {
  constructor(replacements) {
    this.replacements = replacements;
    this.colors = {
      reset: "\x1b[0m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      cyan: "\x1b[36m",
      magenta: "\x1b[35m",
    };
  }

  colorize(color, text) {
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  exec(command) {
    try {
      return execSync(command, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
    } catch {
      return "";
    }
  }

  getConflictFiles() {
    const output = this.exec("git diff --name-only --diff-filter=U");
    return output ? output.split("\n").filter((f) => f) : [];
  }

  // 整文件替换为 theirs（适合 lockfile 等标记损坏的文件）
  acceptIncomingWhole(file) {
    this.exec(`git checkout --theirs "${file}"`);
  }

  // 解析冲突标记，保留非冲突区域，冲突块取 theirs
  resolveConflictMarkers(file) {
    const content = readFileSync(file, "utf-8");
    const regex = /<<<<<<<[^\n]*\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>>[^\n]*/g;
    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // 保留冲突块之前的非冲突内容
      result += content.slice(lastIndex, match.index);
      // 冲突块取 theirs
      result += match[2];

      lastIndex = match.index + match[0].length;
    }

    // 保留最后一个冲突块之后的非冲突内容
    result += content.slice(lastIndex);
    writeFileSync(file, result, "utf-8");
  }

  // 暂存文件
  stageFile(file) {
    console.log(this.colorize("green", `   - [stash] 暂存: ${file}`));
    this.exec(`git add "${file}"`);
  }

  parseFile(file) {
    if (!existsSync(file)) return [];

    const content = readFileSync(file, "utf-8");
    const regex = /<<<<<<<[^\n]*\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>>[^\n]*/g;
    const conflicts = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      conflicts.push({
        ours: match[1],
        theirs: match[2],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    return conflicts;
  }

  // ── 阶段1：检测冲突文件处理 ──
  handleConflictFiles() {
    const files = this.getConflictFiles();

    if (files.length === 0) {
      console.log(this.colorize("green", "✓ 没有发现冲突文件"));
    } else {
      console.log(this.colorize("yellow", `发现 ${files.length} 个冲突文件:\n`));

      files.forEach((file) => {
        console.log(this.colorize("red", `\n📄 文件: ${file}`));
        // 检查是否匹配 glob 模式
        const matchedPattern = Object.keys(DEFAULT_ACCEPT_INCOMING_LIST).find((pattern) =>
          isGlobMatch(file, pattern),
        );
        if (matchedPattern) {
          const strategy = DEFAULT_ACCEPT_INCOMING_LIST[matchedPattern];
          if (strategy === "whole") {
            this.acceptIncomingWhole(file);
          } else {
            this.resolveConflictMarkers(file);
          }
          console.log(
            this.colorize("magenta", `   - [conflict] -> ${strategy} (matched: ${matchedPattern})`),
          );
          this.stageFile(file);
          return;
        }

        const conflicts = this.parseFile(file);

        if (conflicts.length === 0) {
          console.log(this.colorize("cyan", `   - [无冲突] ✓ `));
          this.stageFile(file);
        } else {
          /** 处理 markdown 文件冲突块 */
          let content = readFileSync(file, "utf-8");

          // 计算每个冲突在原始文件中的行号
          const withLines = conflicts.map((c) => {
            const startLine = content.slice(0, c.startIndex).split("\n").length; // 1-based
            const endLine = content.slice(0, c.endIndex).split("\n").length;
            return { ...c, startLine, endLine };
          });

          // 按行号正序，配合 offset 逐块替换
          withLines.sort((a, b) => a.startLine - b.startLine);

          const lines = content.split("\n");
          let offset = 0;

          for (const c of withLines) {
            console.log(this.colorize("green", `\n  冲突块 #${c.startLine}:`));

            const adjStart = c.startLine + offset;
            const adjEnd = c.endLine + offset;
            const origLen = adjEnd - adjStart + 1;
            const theirLines = c.theirs.split("\n");
            const newLen = theirLines.length;

            lines.splice(adjStart - 1, origLen, ...theirLines);

            this.replacements.push({
              current: c.ours,
              incoming: c.theirs,
              file,
              lines: [adjStart, adjStart + newLen - 1],
            });

            offset += newLen - origLen;
          }

          writeFileSync(file, lines.join("\n"), "utf-8");
        }
      });
    }
  }

  // ── 阶段2：检测新增文件 ──
  handleNewFiles() {
    const { sync_branch, upstream_branch } = readState();
    if (!sync_branch || !upstream_branch) {
      console.error(this.colorize("red", "\n 无有效的同步分支或上游分支"));
      return;
    }

    const output = this.exec(
      `git diff --diff-filter=A --name-only ${sync_branch} ${upstream_branch} -- :(glob)src/**/*.md`,
    );
    const newFiles = output.split("\n").filter(Boolean);
    if (newFiles.length === 0) {
      console.log(this.colorize("cyan", "\n📂 没有新增的 .md 文件"));
      return;
    }

    console.log(this.colorize("yellow", `\n📂 发现 ${newFiles.length} 个新增文件:\n`));
    for (const file of newFiles) {
      const content = readFileSync(file, "utf-8");
      const paragraphs = splitIntoParagraphs(content);

      for (const para of paragraphs) {
        this.replacements.push({
          ...para,
          file,
        });
      }
      console.log(
        `   ➕ ${file} (${paragraphs.length} 个段落) → 加入翻译队列`,
      );
    }
  }

  run() {
    console.log(this.colorize("blue", "========================================"));
    console.log(this.colorize("blue", "Vuejs 中文仓库处理 Git 冲突扫描器 (ES6 版本)"));
    console.log(this.colorize("blue", "========================================\n"));

    // ── 阶段1：既有冲突解析逻辑 ──
    this.handleConflictFiles();
    // ── 阶段2：处理新文件 ──
    this.handleNewFiles();
  }
}

export function resolveConflicts() {
  const replacements = [];
  const finder = new GitConflictFinder(replacements);
  finder.run();

  writeFileSync(
    TODO_PATH,
    JSON.stringify(replacements, ["file", "lines", "current", "incoming"], 2),
    "utf-8",
  );

  return replacements;
}

if (isDirectRun(import.meta.url)) {
  resolveConflicts();
}
