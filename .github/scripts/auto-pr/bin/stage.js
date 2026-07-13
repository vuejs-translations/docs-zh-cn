import { execFileSync, execSync } from "child_process";
import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import { detectChanges } from "../src/detect-changes.js";
import { resolveConflicts } from "../src/resolve-conflicts.js";
import { translateConflicts } from "../src/translator.js";
import { applyTranslations } from "../src/apply-translations.js";
import { collectMergeInfo } from "../src/collect-merge-info.js";
import { createPrAndRequestReview } from "../src/create-pr-and-review.js";
import { AUTO_PR_DIR, ROOT, isFileIgnored, isLocal, readJson, readState, writeState } from "../src/helpers.js";

const TODO_PATH = resolve(AUTO_PR_DIR, "todo-translation.json");
const DONE_PATH = resolve(AUTO_PR_DIR, "done-translation.json");
const IGNORE_GLOBS = "src/style-guide/*"; // 忽略翻译的文件 glob 列表，逗号分隔，src/style-guide/*

function isTruthy(value) {
  return value === true || value === "true" || value === "1";
}

function command(commandLine, { inherit = false } = {}) {
  return execSync(commandLine, {
    cwd: ROOT,
    encoding: "utf-8",
    stdio: inherit ? "inherit" : ["pipe", "pipe", "pipe"],
  });
}

function commandOutput(commandLine) {
  return command(commandLine).trim();
}

function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf-8",
    stdio: "inherit",
  });
}

function removeGeneratedArtifacts() {
  for (const path of [TODO_PATH, DONE_PATH]) {
    if (existsSync(path)) unlinkSync(path);
  }
}

function ensureCleanWorkingTree() {
  const status = commandOutput("git status --porcelain");
  if (!status) return;

  console.error("Working tree has uncommitted changes. Local merge test would be unsafe:\n");
  console.error(status);
  process.exit(1);
}

function configureGitUser() {
  if (isLocal()) return; // 本地不改用户配置
  command('git config user.name "github-actions[bot]"');
  command('git config user.email "github-actions[bot]@users.noreply.github.com"');
}

function getSyncBaseHash(upstreamBranch) {
  const base = commandOutput(`git merge-base HEAD origin/${upstreamBranch}`);
  return commandOutput(`git rev-parse --short ${base}`);
}

function checkExistingSyncPr() {
  try {
    const output = execSync(
      'gh pr list --label "从英文版同步" --state open --json number --jq "length"',
      { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
    const count = parseInt(output, 10) || 0;
    console.log(`Existing sync PRs in review: ${count}`);
    return count;
  } catch (err) {
    console.warn("Failed to check existing sync PRs (gh CLI may not be available):", err.message);
    return 0;
  }
}

function isBlockedByExistingSyncPr(state) {
  return (state.existing_sync_pr_count || 0) > 0;
}

async function prepareStage() {
  const upstreamRepo = process.env.UPSTREAM_REPO || "vuejs/docs";
  const upstreamBranch = process.env.UPSTREAM_BRANCH || "upstream";
  const syncBranch = process.env.SYNC_BRANCH || "sync";
  const targetBranch = process.env.TARGET_BRANCH || "main";

  console.log("Stage 1/3: prepare before AI translation");
  removeGeneratedArtifacts();
  configureGitUser();
  if (!isLocal()) {
    command(`git fetch origin ${upstreamBranch}`, { inherit: true });
    command(`git fetch origin ${syncBranch}`, { inherit: true });
    // 切换到 sync 分支，确保 merge、commit、push 都以 sync 为目标
    command(`git checkout -B ${syncBranch} origin/${syncBranch}`, { inherit: true });
  }

  const syncBaseHash = getSyncBaseHash(upstreamBranch);
  const detected = await detectChanges({ upstreamBranch, syncBranch });
  const baseState = {
    upstream_repo: upstreamRepo,
    upstream_branch: upstreamBranch,
    sync_branch: syncBranch,
    target_branch: targetBranch,
    sync_base_hash: syncBaseHash,
    upstream_hash: detected.upstream_hash,
    detect_changed_files: detected.changed_files,
    upstream_behind_count: detected.upstream_behind_count,
    // 特定文件跳过翻译，命中这个 glob 匹配的文件，不会在 todo-translation.json 中生成
    ignore_globs: IGNORE_GLOBS,
  };

  // 打印被 IGNORE_GLOBS 忽略的文件清单
  if (IGNORE_GLOBS && detected.changed_files) {
    const changedFiles = detected.changed_files.split(",").filter(Boolean);
    const ignoredFiles = changedFiles.filter((file) => isFileIgnored(file, IGNORE_GLOBS));
    if (ignoredFiles.length > 0) {
      console.log(`\n以下文件匹配 ignore_globs ("${IGNORE_GLOBS}")，跳过 AI 翻译:`);
      ignoredFiles.forEach((f) => console.log(`  ⏭️  ${f}`));
      console.log(`共 ${ignoredFiles.length} 个文件将被排除在翻译队列之外\n`);
    }
  }

  if (detected.merge_result === "no_changes") {
    writeState({
      ...baseState,
      merge_result: "no_changes",
      merge_status: "skipped",
      has_changes: false,
    });
    console.log("No markdown changes to sync. Later stages will skip.");
    return;
  }

  if (!isLocal()) {
    const existingSyncPrCount = checkExistingSyncPr();
    if (existingSyncPrCount > 0) {
      writeState({
        ...baseState,
        existing_sync_pr_count: existingSyncPrCount,
        has_changes: false,
        merge_result: "blocked_by_existing_pr",
        merge_status: "blocked",
      });
      console.log(
        `Found ${existingSyncPrCount} open PR(s) with label '从英文版同步'. ` +
          "A previous sync is still in review. Skipping translation pipeline.",
      );
      return;
    }
  }

  if (isLocal()) {
    ensureCleanWorkingTree();
  }

  let mergeStatus;
  try {
    command(`git merge origin/${upstreamBranch} --no-edit`, { inherit: true });
    mergeStatus = "clean";
  } catch (err) {
    if (err.status !== 1) {
      throw err;
    }
    mergeStatus = "conflict";
    console.log("Merge has conflicts. Resolving conflict blocks before translation.");
  }

  // 无论是否有冲突，都要检测新文件/修改文件加入翻译队列
  const replacements = resolveConflicts();
  if (replacements.length > 0) {
    console.log(`Prepared ${replacements.length} item(s) for translation.`);
  }
  console.log("[todo-translation.json]", JSON.stringify(readJson(TODO_PATH, []), null, 2));

  writeState({
    ...baseState,
    merge_result: mergeStatus,
    merge_status: mergeStatus,
    has_changes: true,
  });
}

async function translateStage() {
  const state = readState();
  const skipTranslateGate = isTruthy(process.env.SKIP_TRANSLATE_GATE);
  const provider = process.env.TRANSLATE_PROVIDER || (isLocal() ? "claude" : "copilot");

  console.log("Stage 2/3: translate with AI and apply results");

  if (isBlockedByExistingSyncPr(state)) {
    console.log("Blocked by existing sync PR in review. Skipping translation.");
    writeState({ ...state, translation_status: "skipped" });
    return;
  }

  if (!state.has_changes || state.merge_result === "no_changes") {
    console.log("No changes were prepared. Skipping translation.");
    writeState({ ...state, translation_status: "skipped" });
    return;
  }

  // 检查是否存在待翻译内容（来自冲突、新增文件、或修改文件）
  const hasTodoItems = existsSync(TODO_PATH);
  if (!hasTodoItems) {
    console.log("No todo-translation.json found. No translation needed.");
    writeState({ ...state, translation_status: "skipped" });
    return;
  }

  let translation;
  try {
    translation = await translateConflicts({ provider });
  } catch (err) {
    writeState({
      ...state,
      translation_status: "failed",
      translation_provider: provider,
    });

    if (skipTranslateGate) {
      console.warn("Translation failed, but SKIP_TRANSLATE_GATE=true. Continuing.");
      return;
    }

    throw err;
  }

  let applied = false;
  console.log("[done-translation.json]", JSON.stringify(readJson(DONE_PATH, []), null, 2));
  if (existsSync(DONE_PATH)) {
    applyTranslations();
    // 将翻译后的内容重新暂存，确保 staging area 包含中文版
    command("git add -A", { inherit: true });
    applied = true;
  } else {
    console.log("No done-translation.json found. Nothing to apply.");
  }

  writeState({
    ...state,
    translation_status: translation.status,
    translation_provider: provider,
    translations_applied: applied,
  });
}

async function submitStage() {
  const state = readState();
  const skipTranslateGate = isTruthy(process.env.SKIP_TRANSLATE_GATE);

  console.log("Stage 3/3: submit sync branch and create PR");

  if (isBlockedByExistingSyncPr(state)) {
    console.log("Blocked by existing sync PR in review. Skipping submit.");
    return;
  }

  if (!state.has_changes || state.merge_result === "no_changes") {
    console.log("No changes were prepared. Skipping submit.");
    return;
  }

  if (
    state.merge_status === "conflict" &&
    state.translation_status === "failed" &&
    !skipTranslateGate
  ) {
    throw new Error("Translation failed. Refusing to submit without SKIP_TRANSLATE_GATE=true.");
  }

  const info = collectMergeInfo({
    mergeStatus: state.merge_status,
    detectChangedFiles: state.detect_changed_files,
  });
  const nextState = {
    ...state,
    merge_result: info.merge_result,
    conflict_files: info.conflict_files,
    changed_files: info.changed_files,
    create_pr: isTruthy(process.env.CREATE_PR),
  };
  writeState(nextState);

  if (isLocal()) {
    console.log("[local dry-run] Skipping commit and push to sync.");
  } else if (!nextState.create_pr) {
    console.log("[skip-create-pr] CREATED_PR=false, skipping commit and push.");
  } else {
    command("git add -A", { inherit: true });

    let hasStagedChanges = false;
    try {
      command("git diff --cached --quiet");
    } catch (err) {
      if (err.status !== 1) throw err;
      hasStagedChanges = true;
    }

    if (!hasStagedChanges) {
      console.log("No changes to commit.");
    } else {
      const message = `sync(autopr): merge upstream ${nextState.upstream_hash}
- Merge result: ${nextState.merge_result}
- Upstream: ${nextState.upstream_repo}@${nextState.upstream_hash}
sync #${nextState.upstream_hash}`;

      git(["commit", "-m", message]);
    }

    git(["push", "origin", nextState.sync_branch, "--force-with-lease"]);
  }

  await createPrAndRequestReview({
    local: isLocal(),
    upstreamRepo: nextState.upstream_repo,
    syncBranch: nextState.sync_branch,
    targetBranch: nextState.target_branch,
    upstreamHash: nextState.upstream_hash,
    syncBaseHash: nextState.sync_base_hash,
    mergeResult: nextState.merge_result,
    conflictFiles: nextState.conflict_files,
    changedFiles: nextState.changed_files,
    skipCreatePr: !nextState.create_pr,
    githubRepository: process.env.GITHUB_REPOSITORY,
    ghToken: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
  });
}

async function run() {
  const stage = process.argv[2];

  if (stage === "prepare") {
    await prepareStage();
  } else if (stage === "translate") {
    await translateStage();
  } else if (stage === "submit") {
    await submitStage();
  } else if (stage === "--help" || stage === "-h") {
    console.log("Usage: stage.js <prepare|translate|submit>");
  } else {
    console.error("Usage: stage.js <prepare|translate|submit>");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
