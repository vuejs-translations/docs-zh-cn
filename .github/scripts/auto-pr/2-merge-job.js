// git-find-conflicts-es6.js
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";

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

const all_replace_contents = [];

class GitConflictFinder {
  constructor() {
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
        ours: match[1].trim(),
        theirs: match[2].trim(),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    return conflicts;
  }

  // 替换单个冲突块，返回新的内容字符串
  resolveConflictAt(content, conflict) {
    return (
      content.slice(0, conflict.startIndex) + conflict.theirs + content.slice(conflict.endIndex)
    );
  }

  run() {
    console.log(this.colorize("blue", "========================================"));
    console.log(this.colorize("blue", "Vuejs 中文仓库处理 Git 冲突扫描器 (ES6 版本)"));
    console.log(this.colorize("blue", "========================================\n"));

    const files = this.getConflictFiles();

    if (files.length === 0) {
      console.log(this.colorize("green", "✓ 没有发现冲突文件"));
      return;
    }

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
        // 按 startIndex 倒序处理，避免替换后索引偏移
        const sorted = [...conflicts].sort((a, b) => b.startIndex - a.startIndex);
        let content = readFileSync(file, "utf-8");

        sorted.forEach((conflict, idx) => {
          console.log(this.colorize("green", `\n  冲突块 #${conflicts.length - idx}:`));

          // 计算 theirs 替换后的起始和结束行号，然后替换单个冲突块
          const before = content.slice(0, conflict.startIndex);
          const startLine = before.split("\n").length;
          const endLine = startLine + conflict.theirs.split("\n").length - 1;
          content = this.resolveConflictAt(content, conflict);

          all_replace_contents.push({
            current: conflict.ours,
            incoming: conflict.theirs,
            file,
            lines: [startLine, endLine],
          });
        });

        writeFileSync(file, content, "utf-8");
      }
    });
  }
}

const finder = new GitConflictFinder();
finder.run();

writeFileSync(
  ".github/scripts/auto-pr/todo-translation.json",
  JSON.stringify(all_replace_contents, null, 2),
  "utf-8",
);
