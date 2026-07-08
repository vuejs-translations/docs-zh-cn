import { execFileSync, execSync } from "child_process";
import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import { detectChanges } from "../src/detect-changes.js";
import { resolveConflicts } from "../src/resolve-conflicts.js";
import { translateConflicts } from "../src/translator.js";
import { applyTranslations } from "../src/apply-translations.js";
import { collectMergeInfo } from "../src/collect-merge-info.js";
import { createPrAndRequestReview } from "../src/create-pr-and-review.js";
import { AUTO_PR_DIR, ROOT, readState, writeState } from "../src/helpers.js";

const TODO_PATH = resolve(AUTO_PR_DIR, "todo-translation.json");
const DONE_PATH = resolve(AUTO_PR_DIR, "done-translation.json");

function isLocal() {
  return process.env.LOCAL === "true";
}

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
  command('git config user.name "github-actions[bot]"');
  command('git config user.email "github-actions[bot]@users.noreply.github.com"');
}

function getSyncBaseHash(upstreamBranch) {
  const base = commandOutput(`git merge-base HEAD origin/${upstreamBranch}`);
  return commandOutput(`git rev-parse --short ${base}`);
}

async function prepareStage() {
  const upstreamRepo = process.env.UPSTREAM_REPO || "vuejs/docs";
  const upstreamBranch = process.env.UPSTREAM_BRANCH || "upstream";
  const syncBranch = process.env.SYNC_BRANCH || "sync";
  const targetBranch = process.env.TARGET_BRANCH || "main";

  console.log("Stage 1/3: prepare before AI translation");
  removeGeneratedArtifacts();
  configureGitUser();
  command(`git fetch origin ${upstreamBranch}`, { inherit: true });

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
  };

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

  if (mergeStatus === "conflict") {
    const replacements = resolveConflicts();
    console.log(`Prepared ${replacements.length} conflict block(s) for translation.`);
  }

  writeState({
    ...baseState,
    merge_result: mergeStatus,
    merge_status: mergeStatus,
    has_changes: true,
  });
}

function translateStage() {
  const state = readState();
  const skipTranslateGate = isTruthy(process.env.SKIP_TRANSLATE_GATE);
  const provider = process.env.TRANSLATE_PROVIDER || (isLocal() ? "claude" : "copilot");
  const mode = process.env.TRANSLATE_MODE || "all";

  console.log("Stage 2/3: translate with AI and apply results");

  if (!state.has_changes || state.merge_result === "no_changes") {
    console.log("No changes were prepared. Skipping translation.");
    writeState({ ...state, translation_status: "skipped" });
    return;
  }

  if (state.merge_status !== "conflict") {
    console.log("Merge was clean. No conflict translation is required.");
    writeState({ ...state, translation_status: "skipped" });
    return;
  }

  let translation;
  try {
    translation = translateConflicts({ provider, mode });
  } catch (err) {
    writeState({
      ...state,
      translation_status: "failed",
      translation_provider: provider,
      translation_mode: mode,
    });

    if (skipTranslateGate) {
      console.warn("Translation failed, but SKIP_TRANSLATE_GATE=true. Continuing.");
      return;
    }

    throw err;
  }

  let applied = false;
  if (existsSync(DONE_PATH)) {
    applyTranslations();
    applied = true;
  } else {
    console.log("No done-translation.json found. Nothing to apply.");
  }

  writeState({
    ...state,
    translation_status: translation.status,
    translation_provider: provider,
    translation_mode: mode,
    translations_applied: applied,
  });
}

async function submitStage() {
  const state = readState();
  const skipTranslateGate = isTruthy(process.env.SKIP_TRANSLATE_GATE);

  console.log("Stage 3/3: submit sync branch and create PR");

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
  };
  writeState(nextState);

  if (isLocal()) {
    console.log("[local dry-run] Skipping commit and push to sync.");
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
    githubRepository: process.env.GITHUB_REPOSITORY,
    ghToken: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
  });
}

async function run() {
  const stage = process.argv[2];

  if (stage === "prepare") {
    await prepareStage();
  } else if (stage === "translate") {
    translateStage();
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
