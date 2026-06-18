import SimpleGit from "simple-git";
import { appendFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");

const UPSTREAM_BRANCH = process.env.UPSTREAM_BRANCH || "main";
const SYNC_BRANCH = process.env.SYNC_BRANCH || "sync";

const git = SimpleGit(ROOT);

// ── Helpers ──────────────────────────────────────────────────────

function setOutput(key, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    appendFileSync(outputFile, `${key}=${value}\n`);
  }
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  await git.fetch("origin");

  // Get upstream hash
  const upstreamHash = (
    await git.raw(["rev-parse", "--short", "origin/" + UPSTREAM_BRANCH])
  ).trim();
  console.log(`Upstream hash: ${upstreamHash}`);

  // Check if there are upstream commits not yet in sync
  const behind = (
    await git.raw([
      "rev-list",
      "--count",
      `origin/${SYNC_BRANCH}..origin/${UPSTREAM_BRANCH}`,
    ])
  ).trim();

  if (behind === "0") {
    console.log("Sync branch is up to date with upstream. No changes.");
    setOutput("merge_result", "no_changes");
    setOutput("changed_files", "");
    setOutput("upstream_hash", upstreamHash);
    return;
  }

  console.log(`Upstream has ${behind} new commit(s) not in sync.`);

  // Detect changed .md files between sync and upstream (read-only)
  const diff = await git.diff([
    "--name-only",
    "--diff-filter=ACMR",
    `origin/${SYNC_BRANCH}`,
    `origin/${UPSTREAM_BRANCH}`,
    "--",
    "src/**/*.md",
  ]);
  const changedFiles = diff.split("\n").filter(Boolean);
  console.log(`Changed markdown files (${changedFiles.length}):`);
  changedFiles.forEach((f) => console.log(`  ${f}`));

  if (changedFiles.length === 0) {
    console.log("No markdown changes detected (non-md files may have changed).");
    setOutput("merge_result", "no_changes");
    setOutput("changed_files", "");
    setOutput("upstream_hash", upstreamHash);
    return;
  }

  // The actual merge will be done by the merge job — just report what changed
  setOutput("merge_result", "clean");
  setOutput("changed_files", changedFiles.join(","));
  setOutput("upstream_hash", upstreamHash);

  console.log(`\nResult: merge_result=clean`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
