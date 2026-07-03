import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";

const gh = (cmd) => execSync(cmd, { encoding: "utf-8" }).trim();

const {
  GH_TOKEN,
  UPSTREAM_REPO,
  SYNC_BRANCH,
  TARGET_BRANCH,
  UPSTREAM_HASH,
  SYNC_BASE_HASH,
  MERGE_RESULT,
  GITHUB_REPOSITORY,
  LOCAL,
} = process.env;

let { CONFLICT_FILES, CHANGED_FILES } = process.env;
const repo = GITHUB_REPOSITORY || "vuejs-translations/docs-zh-cn";

// ── Build PR body (shared for both local dry-run and CI) ──
function buildPrBody() {
  let body = `## Upstream Sync\n\n- Upstream: \`${UPSTREAM_REPO}\` @ \`${UPSTREAM_HASH}\`\n- Merge result: \`${MERGE_RESULT}\`\n`;

  if (SYNC_BASE_HASH && UPSTREAM_HASH) {
    body += `\n- https://github.com/${UPSTREAM_REPO}/compare/${SYNC_BASE_HASH}...${UPSTREAM_HASH}\n`;
  }

  body += `\n\n ## Changes \n`;

  if (CONFLICT_FILES) {
    body += `### Conflict files (resolved)\n`;
    body += CONFLICT_FILES.split(",")
      .map((f) => `- ${f.trim()}`)
      .join("\n");
    body += "\n";
  }

  if (CHANGED_FILES) {
    body += `### Translated files\n`;
    body += CHANGED_FILES.split(",")
      .map((f) => `- ${f.trim()}`)
      .join("\n");
    body += "\n";
  }

  body += `\n> Automated by [autopr.yml](.github/workflows/autopr.yml)\n`;
  return body;
}

// ── LOCAL mode: dry-run, print PR content and exit ──
if (LOCAL) {
  // Read actual data from JSON artifacts when env vars are missing
  const todoPath = ".github/scripts/auto-pr/todo-translation.json";
  const donePath = ".github/scripts/auto-pr/done-translation.json";
  if (!CONFLICT_FILES && existsSync(todoPath)) {
    const items = JSON.parse(readFileSync(todoPath, "utf-8"));
    CONFLICT_FILES = [...new Set(items.map((i) => i.file))].join(",");
  }
  if (!CHANGED_FILES && existsSync(donePath)) {
    const items = JSON.parse(readFileSync(donePath, "utf-8"));
    CHANGED_FILES = [...new Set(items.map((i) => i.file))].join(",");
  }

  const body = buildPrBody();
  console.log(`[local dry-run] PR Title: Sync(autopr) #${UPSTREAM_HASH || "(unknown-hash)"} — upstream merge & translate`);
  console.log(`[local dry-run] PR Body:\n${body}`);
  process.exit(0);
}

// ── 1. Check if PR already exists ──
const existing = gh(
  `gh pr list --repo "${repo}" --base "${TARGET_BRANCH}" --head "${SYNC_BRANCH}" --state open --json number --jq '.[0].number'`,
);

let prNumber;

if (existing) {
  console.log(`PR already exists: #${existing}`);
  prNumber = existing;
} else {
  // ── 2. Build PR body ──
  const body = buildPrBody();

  // ── 3. Create PR ──
  const tmpFile = "/tmp/pr-body.md";
  writeFileSync(tmpFile, body, "utf-8");
  const prUrl = gh(
    `gh pr create --repo "${repo}" --base "${TARGET_BRANCH}" --head "${SYNC_BRANCH}" --title "Sync(autopr) #${UPSTREAM_HASH} — upstream merge & translate" --body-file "${tmpFile}" --label "从英文版同步" --label "请使用 merge commit 合并"`,
  );
  unlinkSync(tmpFile);

  prNumber = prUrl.match(/(\d+)$/)?.[1];
  console.log(`Created PR: #${prNumber}`);
}

// ── 4. Request Copilot review ──
const apiBase = `https://api.github.com/repos/${repo}`;

async function requestReview() {
  // Request Copilot PR reviewer
  await fetch(`${apiBase}/pulls/${prNumber}/requested_reviewers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ reviewers: ["copilot-pull-request-reviewer[bot]"] }),
  });

  // Post review instruction comment
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
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ body: commentBody }),
  });

  console.log(`Review requested on PR #${prNumber}`);
}

requestReview();
