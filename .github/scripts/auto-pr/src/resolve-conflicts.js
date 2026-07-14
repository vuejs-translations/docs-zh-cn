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

// ============================================================
// 工具函数
// ============================================================

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

function exec(command, { debug = false } = {}) {
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

// ============================================================
// 阶段 1：Git 冲突解析（只做 git 操作）
// ============================================================

function getConflictFiles() {
  const output = exec("git diff --name-only --diff-filter=U");
  return output ? output.split("\n").filter((f) => f) : [];
}

// 整文件替换为 theirs（适合 lockfile 等标记损坏的文件）
function acceptIncomingWhole(file) {
  exec(`git checkout --theirs "${file}"`);
}

// 解析冲突标记，保留非冲突区域，冲突块取 theirs
function resolveConflictMarkers(file) {
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
function stageFile(file) {
  console.log(colorize("green", `   - [stash] 暂存: ${file}`));
  exec(`git add "${file}"`);
}

// 解析冲突块
function parseConflictMarkers(file) {
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

// 处理冲突文件：只做 git 操作，不生成翻译条目
function handleConflictFiles() {
  const files = getConflictFiles();

  if (files.length === 0) {
    console.log(colorize("green", "✓ 没有发现冲突文件"));
    return;
  }

  console.log(colorize("yellow", `发现 ${files.length} 个冲突文件:\n`));

  files.forEach((file) => {
    console.log(colorize("red", `\n📄 文件: ${file}`));

    // 检查是否匹配 glob 模式
    const matchedPattern = Object.keys(DEFAULT_ACCEPT_INCOMING_LIST).find((pattern) =>
      isGlobMatch(file, pattern),
    );
    if (matchedPattern) {
      const strategy = DEFAULT_ACCEPT_INCOMING_LIST[matchedPattern];
      if (strategy === "whole") {
        acceptIncomingWhole(file);
      } else {
        resolveConflictMarkers(file);
      }
      console.log(
        colorize("magenta", `   - [conflict] -> ${strategy} (matched: ${matchedPattern})`),
      );
      stageFile(file);
      return;
    }

    // 普通 markdown 文件的冲突：直接用 theirs 替换冲突块
    const conflicts = parseConflictMarkers(file);

    if (conflicts.length === 0) {
      console.log(colorize("cyan", `   - [无冲突] ✓ `));
      stageFile(file);
      return;
    }

    // 计算行号，逐块替换冲突区域为 theirs
    let content = readFileSync(file, "utf-8");

    const withLines = conflicts.map((c) => {
      const startLine = content.slice(0, c.startIndex).split("\n").length;
      const endLine = content.slice(0, c.endIndex).split("\n").length;
      return { ...c, startLine, endLine };
    });

    withLines.sort((a, b) => a.startLine - b.startLine);

    const lines = content.split("\n");
    let offset = 0;

    for (const c of withLines) {
      console.log(colorize("green", `  冲突块 #${c.startLine}`));

      const adjStart = c.startLine + offset;
      const adjEnd = c.endLine + offset;
      const origLen = adjEnd - adjStart + 1;
      const theirLines = c.theirs.replace(/\r\n/g, "\n").split("\n");

      lines.splice(adjStart - 1, origLen, ...theirLines);
      offset += theirLines.length - origLen;
    }

    writeFileSync(file, lines.join("\n"), "utf-8");
    stageFile(file);
  });
}

// ============================================================
// 阶段 2：冲突解决后，通过 git diff --cached 生成翻译队列
// ============================================================

// 解析 unified diff（--unified=0），提取每个 hunk 的旧/新内容
// 返回 { current, incoming, lines }[]
function parseDiffHunks(diffOutput) {
  const entries = [];
  let cur = null;

  for (const line of diffOutput.split("\n")) {
    const m = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (m) {
      if (cur) {
        cur.current = cur.oldLines.join("\n");
        cur.incoming = cur.newLines.join("\n");
        cur.lines = [cur.newStart, cur.newStart + cur.newCount - 1];
        entries.push({ current: cur.current, incoming: cur.incoming, lines: cur.lines });
      }
      cur = { newStart: parseInt(m[3], 10), newCount: parseInt(m[4] || "1", 10), oldLines: [], newLines: [] };
      continue;
    }
    if (!cur) continue;
    if (line.startsWith("-")) cur.oldLines.push(line.slice(1));
    else if (line.startsWith("+")) cur.newLines.push(line.slice(1));
  }
  if (cur) {
    entries.push({
      current: cur.oldLines.join("\n"),
      incoming: cur.newLines.join("\n"),
      lines: [cur.newStart, cur.newStart + cur.newCount - 1],
    });
  }

  return entries;
}

function generateTodo() {
  const stagedOutput = exec(
    `git diff --cached --name-only --diff-filter=AM -- ":(glob)src/**/*.md"`,
  );
  const stagedFiles = stagedOutput.split("\n").filter(Boolean);

  if (stagedFiles.length === 0) {
    console.log(colorize("cyan", "\n没有需要翻译的文件"));
    return [];
  }

  console.log(colorize("yellow", `\n发现 ${stagedFiles.length} 个待处理文件:\n`));

  const replacements = [];
  let lastFile = "";

  for (const file of stagedFiles) {
    const entries = parseDiffHunks(
      exec(`git diff --cached --unified=0 -- "${file}"`),
    );
    if (entries.length === 0) {
      if (file !== lastFile) console.log(`   ✓ ${file}`);
      continue;
    }

    // 跳过纯删除（newCount=0）和无变更（old===new）的 hunk
    const todo = entries.filter((e) => e.lines[0] <= e.lines[1] && e.current !== e.incoming);
    if (todo.length === 0) {
      if (file !== lastFile) console.log(`   ✓ ${file}`);
      continue;
    }

    for (const entry of todo) {
      replacements.push({ ...entry, file });
    }
    console.log(`   ✏️ ${file} (${todo.length} 处变更)`);
    lastFile = file;
  }

  return replacements;
}

// ============================================================
// 入口：先解决冲突，再生成翻译队列
// ============================================================

export function resolveConflicts() {
  console.log(colorize("blue", "========================================"));
  console.log(colorize("blue", "Vuejs 中文仓库 Git 冲突扫描器"));
  console.log(colorize("blue", "========================================\n"));

  // 步骤 1：处理 git 冲突（只做 git 操作）
  handleConflictFiles();

  // 步骤 2：git diff --cached 对比 HEAD vs staged，生成 todo
  console.log(colorize("blue", "\n--- 检测变更，生成翻译队列 ---"));
  const replacements = generateTodo();

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

  if (filtered.length > 0) {
    console.log(colorize("cyan", `\n总共 ${filtered.length} 个待翻译条目\n`));
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
