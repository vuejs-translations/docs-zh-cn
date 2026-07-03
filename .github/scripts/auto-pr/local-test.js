#!/usr/bin/env node

/**
 * local-test.js — 本地步骤调度器
 *
 * 设 LOCAL=true 后依次执行各脚本。每个脚本通过自身对 LOCAL 的判断处理输出
 * （setOutput → 同时写 GITHUB_OUTPUT 和打印 stdout），不再需要编排器 mock。
 *
 * 用法：
 *   node .github/scripts/auto-pr/local-test.js --step 1          # 只跑步骤 1
 *   node .github/scripts/auto-pr/local-test.js --step 1,2,3      # 跑步骤 1、2、3
 *   node .github/scripts/auto-pr/local-test.js --step all        # 跑所有步骤
 *   node .github/scripts/auto-pr/local-test.js --step 3 --mode file  # 指定翻译模式
 * 注意：
 *  当 package.json 冲突时，node 执行步骤 2 会失败，请使用 bun
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");
const SCRIPTS = __dirname;

// ── Args ──

const args = process.argv.slice(2);
const stepArg = parseArg(args, "--step") || "all";
const translateMode = parseArg(args, "--mode") || "all";
const ALL_STEPS = [1, 2, 3, 4, 5, 6];

const selectedSteps =
  stepArg === "all" ? [...ALL_STEPS] : stepArg.split(",").map(Number).filter(Boolean);

for (const s of selectedSteps) {
  if (!ALL_STEPS.includes(s)) {
    console.error(`Invalid step: ${s}. Valid: ${ALL_STEPS.join(",")} or all`);
    process.exit(1);
  }
}

function parseArg(argv, name) {
  const idx = argv.indexOf(name);
  return idx === -1 ? null : argv[idx + 1] || null;
}

// ── Helpers ──

const SEP = "=".repeat(72);

const STEP_SCRIPTS = {
  1: { script: "1-detect-changes-job.js", label: "检测变更" },
  2: { script: "2-merge-job.js", label: "合并冲突解析" },
  3: {
    script: "3-local-job.js",
    label: "翻译 (Claude CLI)",
    depHint: "请先执行步骤 2 生成 todo-translation.json",
  },
  4: {
    script: "4-apply-job.js",
    label: "应用翻译",
    depHint: "请先执行步骤 3 生成 done-translation.json",
  },
  5: {
    script: "5-collect-merge-info.js",
    label: "收集合并信息",
    depHint: "请先执行步骤 2 生成 todo-translation.json",
  },
  6: { script: "6-create-pr-and-review.js", label: "PR 内容预览 (dry-run)" },
};

// Lookup by step number for dependency hints
const STEPS_BY_NUM = STEP_SCRIPTS;

// ── Main ──

process.env.LOCAL = "true";

console.log(`\n${SEP}`);
console.log(`  Auto-PR 本地测试`);
console.log(`  步骤: ${selectedSteps.join(", ")}`);
if (selectedSteps.includes(3)) console.log(`  翻译模式: ${translateMode}`);
console.log(`${SEP}\n`);

for (const stepNum of selectedSteps) {
  const { script, label } = STEP_SCRIPTS[stepNum];

  console.log(`\n${SEP}`);
  console.log(`  步骤 ${stepNum}: ${label}`);
  console.log(`  ${new Date().toISOString()}`);
  console.log(`${SEP}\n`);

  const env = { ...process.env };
  if (stepNum === 3) env.TRANSLATE_MODE = translateMode;

  // Pre-check: required artifacts from earlier steps
  const deps = {
    3: [".github/scripts/auto-pr/todo-translation.json"],
    4: [".github/scripts/auto-pr/done-translation.json"],
    5: [".github/scripts/auto-pr/todo-translation.json"],
  };
  for (const dep of deps[stepNum] || []) {
    if (!existsSync(resolve(ROOT, dep))) {
      console.error(`  ✗ 前置产物缺失: ${dep}`);
      console.error(`    ${STEPS_BY_NUM[stepNum].depHint}`);
      process.exit(1);
    }
  }

  try {
    // Step 2 is special: CI does `git merge` then runs 2-merge-job.js only on conflict
    if (stepNum === 2) {
      // Pre-check: dirty working tree blocks merge
      const status = execSync("git status --porcelain", {
        cwd: ROOT,
        encoding: "utf-8",
      }).trim();
      if (status) {
        console.error("  ✗ 工作区有未提交的更改，merge 被 git 拒绝。请先提交或暂存：\n");
        execSync("git status --short", { cwd: ROOT, stdio: "inherit" });
        console.log("\n  提交当前改动后再重试：");
        console.log('    git add -A && git commit -m "chore: auto-pr local test changes"');
        process.exit(1);
      }

      console.log("  ▶ git fetch origin upstream\n");
      execSync("git fetch origin upstream", { cwd: ROOT, stdio: "inherit" });

      console.log("  ▶ git merge origin/upstream\n");
      let mergeStatus;
      try {
        execSync("git merge origin/upstream --no-edit", {
          cwd: ROOT,
          stdio: "inherit",
          encoding: "utf-8",
        });
        mergeStatus = "clean";
      } catch (err) {
        // exit code 1 = real content conflict; exit code 128 = other error
        mergeStatus = err.status === 1 ? "conflict" : "error";
      }

      if (mergeStatus === "conflict") {
        console.log("\n  Merge 产生冲突。\n");

        // Pre-resolve package.json so Node.js can start (CI uses bun, no package.json issue)
        console.log("  ⚠  package.json 冲突 -> accept theirs (Node.js 启动需要)\n");
        execSync("git checkout --theirs -- package.json && git add package.json", {
          cwd: ROOT,
          stdio: "pipe",
        });

        console.log("  运行 2-merge-job.js 解析剩余冲突...\n");
        execSync(`node "${resolve(SCRIPTS, script)}"`, {
          cwd: ROOT,
          env,
          stdio: "inherit",
        });
      } else if (mergeStatus === "clean") {
        console.log("\n  Merge 无冲突，无需解析。\n");
      } else {
        console.error(`\n  ✗ Merge 失败 (非冲突错误)，请手动排查。\n`);
        process.exit(1);
      }
    } else {
      const scriptPath = resolve(SCRIPTS, script);
      execSync(`node "${scriptPath}"`, {
        cwd: ROOT,
        env,
        stdio: "inherit",
        timeout: 300_000,
      });
    }

    console.log(`\n  ✓ 步骤 ${stepNum} 完成`);
  } catch (err) {
    console.error(`\n  ✗ 步骤 ${stepNum} 失败 (exit: ${err.status})`);
    process.exit(1);
  }
}

console.log(`\n${SEP}`);
console.log(`  ✅ 所有步骤完成`);
console.log(`${SEP}\n`);
