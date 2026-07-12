import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { AUTO_PR_DIR, ROOT, isDirectRun } from "./helpers.js";

const DONE_PATH = resolve(AUTO_PR_DIR, "done-translation.json");

export function applyTranslations() {
  const raw = readFileSync(DONE_PATH, "utf-8").replace(/^\uFEFF/, "");
  const items = JSON.parse(raw);

  // 按文件分组，同一文件内正序替换 + offset 累积修正索引偏移
  const grouped = {};
  for (const item of items) {
    if (!grouped[item.file]) grouped[item.file] = [];
    grouped[item.file].push(item);
  }

  for (const [file, conflicts] of Object.entries(grouped)) {
    // 兼容 lines: [start, end] 和 line: number 两种格式
    const getRange = (c) => c.lines ?? [c.line, c.line];

    // 按行号正序
    conflicts.sort((a, b) => getRange(a)[0] - getRange(b)[0]);

    const filePath = resolve(ROOT, file);
    const lines = readFileSync(filePath, "utf-8").split("\n");

    // 记录每次替换后行数的变化，修正后续冲突的行号
    let offset = 0;

    for (const c of conflicts) {
      const [origStart, origEnd] = getRange(c); // 1-based
      const adjStart = origStart + offset;
      const adjEnd = origEnd + offset;
      const origLen = adjEnd - adjStart + 1;
      const transLines = c.review.split("\n");
      const newLen = transLines.length;

      lines.splice(adjStart - 1, origLen, ...transLines);
      offset += newLen - origLen;
    }

    writeFileSync(filePath, lines.join("\n"), "utf-8");
    console.log(`已替换: ${file} (${conflicts.length} 处)`);
  }
}

if (isDirectRun(import.meta.url)) {
  applyTranslations();
}
