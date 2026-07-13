import SimpleGit from "simple-git";
import { isDirectRun, isLocal, ROOT, setOutput } from "./helpers.js";

const git = SimpleGit(ROOT);

export async function detectChanges({
  upstreamBranch = process.env.UPSTREAM_BRANCH || "upstream",
  syncBranch = process.env.SYNC_BRANCH || "sync",
} = {}) {
  if (!isLocal()) {
    await git.fetch("origin");
  }

  const upstreamRef = isLocal() ? upstreamBranch : `origin/${upstreamBranch}`;
  const syncRef = isLocal() ? syncBranch : `origin/${syncBranch}`;

  // Get upstream hash
  const upstreamHash = (await git.raw(["rev-parse", "--short", upstreamRef])).trim();
  console.log(`Upstream hash: ${upstreamHash}`);

  // Check if there are upstream commits not yet in sync
  const behind = (
    await git.raw([
      "rev-list",
      "--count",
      `${syncRef}..${upstreamRef}`,
    ])
  ).trim();

  if (behind === "0") {
    console.log("Sync branch is up to date with upstream. No changes.");
    return {
      merge_result: "no_changes",
      changed_files: "",
      upstream_hash: upstreamHash,
      upstream_behind_count: 0,
    };
  }

  console.log(`Upstream has ${behind} new commit(s) not in sync.`);

  // Detect changed .md files between sync and upstream (read-only)
  const diff = await git.diff([
    "--name-only",
    "--diff-filter=ACMR",
    `${syncRef}`,
    upstreamRef,
    "--",
    "src/**/*.md",
  ]);
  const changedFiles = diff.split("\n").filter(Boolean);
  console.log(`Changed markdown files (${changedFiles.length}):`);
  changedFiles.forEach((f) => console.log(`  ${f}`));

  if (changedFiles.length === 0) {
    console.log("No markdown changes detected (non-md files may have changed).");
    return {
      merge_result: "no_changes",
      changed_files: "",
      upstream_hash: upstreamHash,
      upstream_behind_count: Number(behind),
    };
  }

  // The actual merge will be done by the merge job — just report what changed
  console.log(`\nResult: merge_result=clean`);

  return {
    merge_result: "clean",
    changed_files: changedFiles.join(","),
    upstream_hash: upstreamHash,
    upstream_behind_count: Number(behind),
  };
}

function emitResult(result) {
  setOutput("merge_result", result.merge_result);
  setOutput("changed_files", result.changed_files);
  setOutput("upstream_hash", result.upstream_hash);
}

if (isDirectRun(import.meta.url)) {
  detectChanges()
    .then(emitResult)
    .catch((err) => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}
