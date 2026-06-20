import { readFileSync, writeFileSync } from "fs";

const raw = readFileSync(".github/scripts/auto-pr/done-translation.json", "utf-8").replace(
  /^\uFEFF/,
  "",
);
const items = JSON.parse(raw);

// 按文件分组，同一文件内从后往前替换避免索引偏移
const grouped = {};
for (const item of items) {
  if (!grouped[item.file]) grouped[item.file] = [];
  grouped[item.file].push(item);
}

for (const [file, conflicts] of Object.entries(grouped)) {
  // 兼容 lines: [start, end] 和 line: number 两种格式
  const getRange = (c) => c.lines ?? [c.line, c.line];

  // 按行号倒序
  conflicts.sort((a, b) => getRange(b)[0] - getRange(a)[0]);

  const lines = readFileSync(file, "utf-8").split("\n");

  for (const c of conflicts) {
    const [start, end] = getRange(c); // 1-based
    const transLines = c.review.split("\n");
    lines.splice(start - 1, end - start + 1, ...transLines);
  }

  writeFileSync(file, lines.join("\n"), "utf-8");
  console.log(`已替换: ${file} (${conflicts.length} 处)`);
}
