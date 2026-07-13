import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { AUTO_PR_DIR, isDirectRun, isFileIgnored, isGlobMatch, readState } from "./helpers.js";

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

  exec(command, { debug = false } = {}) {
    try {
      const result = execSync(command, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();
      return result;
    } catch (e) {
      if (debug) {
        console.log(`[exec debug] cmd: ${command}`);
        console.log(`[exec debug] stdout: ${e.stdout?.toString().trim() || "(empty)"}`);
        console.log(`[exec debug] stderr: ${e.stderr?.toString().trim() || "(empty)"}`);
        console.log(`[exec debug] status: ${e.status}`);
      }
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
          this.stageFile(file);
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

    // debug: 验证 ref 状态
    const syncRev = this.exec(`git rev-parse --short ${sync_branch}`);
    const upstreamRev = this.exec(`git rev-parse --short ${upstream_branch}`);
    const mergeBase = this.exec(`git merge-base ${sync_branch} ${upstream_branch}`);
    console.log(`[debug] sync=${syncRev}, upstream=${upstreamRev}, merge-base=${mergeBase ? mergeBase.substring(0, 8) : "empty"}`);

    const output = this.exec(
      `git diff --diff-filter=A --name-only ${sync_branch} ${upstream_branch} -- :(glob)src/**/*.md`,
      { debug: true },
    );
    console.log(`[debug] raw output length: ${output.length}, first 200 chars: ${output.substring(0, 200).replace(/\n/g, "\\n")}`);
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

  // ── 阶段3：检测内容有变更的已有文件 ──
  handleModifiedFiles() {
    const { sync_branch, upstream_branch } = readState();
    if (!sync_branch || !upstream_branch) {
      console.error(this.colorize("red", "\n 无有效的同步分支或上游分支"));
      return;
    }

    // debug: 验证 ref 状态
    const syncRev2 = this.exec(`git rev-parse --short ${sync_branch}`);
    const upstreamRev2 = this.exec(`git rev-parse --short ${upstream_branch}`);
    console.log(`[debug] sync=${syncRev2}, upstream=${upstreamRev2}`);

    // debug: 对比 with/without :(glob)
    const outGlob = this.exec(
      `git diff --diff-filter=M --name-only ${sync_branch} ${upstream_branch} -- ":(glob)src/**/*.md"`,
      { debug: true },
    );
    const outNoGlob = this.exec(
      `git diff --diff-filter=M --name-only ${sync_branch} ${upstream_branch} -- src/**/*.md`,
      { debug: true },
    );
    console.log(`[debug] output with :(glob): ${outGlob.split("\n").filter(Boolean).length} files`);
    console.log(`[debug] output without :(glob): ${outNoGlob.split("\n").filter(Boolean).length} files`);

    const output = this.exec(
      `git diff --diff-filter=M --name-only ${sync_branch} ${upstream_branch} -- :(glob)src/**/*.md`,
      { debug: true },
    );
    console.log(`[debug] raw output length: ${output.length}, first 200 chars: ${output.substring(0, 200).replace(/\n/g, "\\n")}`);
    const modifiedFiles = output.split("\n").filter(Boolean);
    if (modifiedFiles.length === 0) {
      console.log(this.colorize("cyan", "\n📝 没有修改的 .md 文件"));
      return;
    }

    // 获取 merge-base，即上游上次同步的位置
    const mergeBase = this.exec(`git merge-base ${sync_branch} ${upstream_branch}`);
    console.log(`[debug] merge-base for modified files: ${mergeBase ? mergeBase.substring(0, 8) : "empty"}`);
    if (!mergeBase) {
      console.error(this.colorize("red", "\n 无法获取 merge-base"));
      return;
    }

    console.log(this.colorize("yellow", `\n📝 发现 ${modifiedFiles.length} 个修改文件 (merge-base: ${mergeBase}):\n`));

    for (const file of modifiedFiles) {
      // 对比上游英文版自身的变化（merge-base vs 当前 upstream）
      const diffOutput = this.exec(
        `git diff --unified=0 ${mergeBase} ${upstream_branch} -- "${file}"`,
      );
      if (!diffOutput) {
        console.log(`   ⏭️  ${file} (无差异)`);
        continue;
      }

      // 解析 hunk 头，提取上游新版本中受影响行的行号
      const changedLines = new Set();
      for (const line of diffOutput.split("\n")) {
        const match = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
        if (match) {
          const start = parseInt(match[1], 10);
          const count = parseInt(match[2] || "1", 10);
          for (let i = start; i < start + count; i++) {
            changedLines.add(i);
          }
        }
      }

      if (changedLines.size === 0) {
        console.log(`   ✓ ${file} (无新增行)`);
        continue;
      }

      // 读取合并后的文件，找到包含变更行的段落
      const mergedContent = readFileSync(file, "utf-8");
      const paragraphs = splitIntoParagraphs(mergedContent);

      const changedParas = paragraphs.filter((para) => {
        const [pStart, pEnd] = para.lines;
        for (let line = pStart; line <= pEnd; line++) {
          if (changedLines.has(line)) return true;
        }
        return false;
      });

      if (changedParas.length > 0) {
        for (const para of changedParas) {
          this.replacements.push({
            current: "",
            incoming: para.incoming,
            file,
            lines: para.lines,
          });
        }
        console.log(`   ✏️ ${file} (${changedParas.length} 个受影响段落) → 加入翻译队列`);
      } else {
        console.log(`   ✓ ${file} (段落无变化)`);
      }
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
    // ── 阶段3：处理有变更的已有文件 ──
    this.handleModifiedFiles();
  }
}

export function resolveConflicts() {
  const replacements = [];
  const finder = new GitConflictFinder(replacements);
  finder.run();

  // 过滤掉被 ignore_globs 排除的文件
  const { ignore_globs } = readState();
  let filtered = replacements;
  if (ignore_globs) {
    filtered = replacements.filter((item) => !isFileIgnored(item.file, ignore_globs));

    const excludedFiles = [
      ...new Set(
        replacements
          .filter((item) => isFileIgnored(item.file, ignore_globs))
          .map((item) => item.file),
      ),
    ];
    if (excludedFiles.length > 0) {
      console.log(
        `\n以下文件匹配 ignore_globs ("${ignore_globs}")，跳过 AI 翻译:`,
      );
      excludedFiles.forEach((f) => console.log(`  ⏭️  ${f}`));
      const excludedCount = replacements.length - filtered.length;
      console.log(`共排除 ${excludedFiles.length} 个文件（${excludedCount} 个条目）\n`);
    }
  }

  writeFileSync(
    TODO_PATH,
    JSON.stringify(filtered, ["file", "lines", "current", "incoming"], 2),
    "utf-8",
  );

  return filtered;
}

if (isDirectRun(import.meta.url)) {
  resolveConflicts();
}
