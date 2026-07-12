import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { resolve } from "path";
import { AUTO_PR_DIR, isDirectRun } from "./helpers.js";

const gh = (cmd) => execSync(cmd, { encoding: "utf-8" }).trim();
const TODO_PATH = resolve(AUTO_PR_DIR, "todo-translation.json");
const DONE_PATH = resolve(AUTO_PR_DIR, "done-translation.json");

function readArtifactFiles({ conflictFiles, changedFiles }) {
  let resolvedConflictFiles = conflictFiles;
  let resolvedChangedFiles = changedFiles;

  if (!resolvedConflictFiles && existsSync(TODO_PATH)) {
    const items = JSON.parse(readFileSync(TODO_PATH, "utf-8"));
    resolvedConflictFiles = [...new Set(items.map((i) => i.file))].join(",");
  }

  if (!resolvedChangedFiles && existsSync(DONE_PATH)) {
    const items = JSON.parse(readFileSync(DONE_PATH, "utf-8"));
    resolvedChangedFiles = [...new Set(items.map((i) => i.file))].join(",");
  }

  return {
    conflictFiles: resolvedConflictFiles,
    changedFiles: resolvedChangedFiles,
  };
}

export function buildPrBody({
  upstreamRepo,
  upstreamHash,
  syncBaseHash,
  mergeResult,
  conflictFiles,
  changedFiles,
}) {
  let body = `## Upstream Sync\n\n- Upstream: \`${upstreamRepo}\` @ \`${upstreamHash}\`\n- Merge result: \`${mergeResult}\`\n`;

  if (syncBaseHash && upstreamHash) {
    body += `\n- [View upstream changes](https://github.com/${upstreamRepo}/compare/${syncBaseHash}...${upstreamHash})\n`;
  }

  body += `\n\n## Changes\n`;

  if (conflictFiles) {
    body += `### Conflict files (resolved)\n`;
    body += conflictFiles
      .split(",")
      .map((f) => `- ${f.trim()}`)
      .join("\n");
    body += "\n";
  }

  if (changedFiles) {
    body += `### Changed Markdown files\n`;
    body += changedFiles
      .split(",")
      .map((f) => `- ${f.trim()}`)
      .join("\n");
    body += "\n";
  }

  body += `\n> Automated by [autopr.yml](.github/workflows/autopr.yml)\n`;
  return body;
}

export async function createPrAndRequestReview(options = {}) {
  const repo = options.githubRepository || process.env.GITHUB_REPOSITORY || "vuejs-translations/docs-zh-cn";
  const upstreamRepo = options.upstreamRepo || process.env.UPSTREAM_REPO;
  const syncBranch = options.syncBranch || process.env.SYNC_BRANCH;
  const targetBranch = options.targetBranch || process.env.TARGET_BRANCH;
  const upstreamHash = options.upstreamHash || process.env.UPSTREAM_HASH;
  const syncBaseHash = options.syncBaseHash || process.env.SYNC_BASE_HASH;
  const mergeResult = options.mergeResult || process.env.MERGE_RESULT;
  const local = options.local ?? process.env.LOCAL === "true";
  const ghToken = options.ghToken || process.env.GH_TOKEN;

  const { conflictFiles, changedFiles } = readArtifactFiles({
    conflictFiles: options.conflictFiles || process.env.CONFLICT_FILES,
    changedFiles: options.changedFiles || process.env.CHANGED_FILES,
  });

  const title = `Sync(autopr) #${upstreamHash || "(unknown-hash)"} — upstream merge & translate`;
  const body = buildPrBody({
    upstreamRepo,
    upstreamHash,
    syncBaseHash,
    mergeResult,
    conflictFiles,
    changedFiles,
  });

  if (local) {
    console.log(`[local dry-run] PR Title: ${title}`);
    console.log(`[local dry-run] PR Body:\n${body}`);
    return { prNumber: null, title, body };
  }

  const existing = gh(
    `gh pr list --repo "${repo}" --base "${targetBranch}" --head "${syncBranch}" --state open --json number --jq '.[0].number'`,
  );

  let prNumber;

  if (existing) {
    console.log(`PR already exists: #${existing}`);
    prNumber = existing;
  } else {
    const tmpFile = "/tmp/pr-body.md";
    writeFileSync(tmpFile, body, "utf-8");
    const prUrl = gh(
      `gh pr create --repo "${repo}" --base "${targetBranch}" --head "${syncBranch}" --title "${title}" --body-file "${tmpFile}" --label "从英文版同步" --label "请使用 merge commit 合并"`,
    );
    unlinkSync(tmpFile);

    prNumber = prUrl.match(/(\d+)$/)?.[1];
    console.log(`Created PR: #${prNumber}`);
  }

  const apiBase = `https://api.github.com/repos/${repo}`;

  await fetch(`${apiBase}/pulls/${prNumber}/requested_reviewers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ghToken}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ reviewers: ["copilot-pull-request-reviewer[bot]"] }),
  });

  const commentBody =
    `@veaba review\n\n` +
    `Please review this automated sync PR:\n` +
    `1. Translation accuracy per conventions from the [vuejs-docs-zh-cn](https://github.com/${repo}/blob/main/.claude/skills/vuejs-docs-zh-cn/SKILL.md) skill.\n` +
    `2. No unintended content changes.\n` +
    `3. Markdown formatting preserved.\n` +
    `4. Code blocks and links intact.\n` +
    `> Expected conflict on \`sync\` to \`main\` — resolve manually.\n`;

  await fetch(`${apiBase}/issues/${prNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ghToken}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ body: commentBody }),
  });

  console.log(`Review requested on PR #${prNumber}`);
  return { prNumber, title, body };
}

if (isDirectRun(import.meta.url)) {
  createPrAndRequestReview().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
