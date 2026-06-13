import SimpleGit from 'simple-git';
import OpenAI from 'openai';
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const UPSTREAM_REPO = 'vuejs/docs';
const UPSTREAM_BRANCH = process.env.UPSTREAM_BRANCH || 'main';
const SYNC_BRANCH = process.env.SYNC_BRANCH || 'sync';

const git = SimpleGit(ROOT);
const ai = new OpenAI({
  baseURL: 'https://models.github.ai/inference',
  apiKey: process.env.GITHUB_TOKEN,
});

async function mergeUpstream() {
  await git.addConfig('user.name', 'github-actions[bot]');
  await git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com');

  // Ensure sync branch exists
  const branches = await git.branchLocal();
  if (!branches.all.includes(SYNC_BRANCH)) {
    console.log(`Creating ${SYNC_BRANCH} branch from origin/main...`);
    await git.checkoutBranch(SYNC_BRANCH, 'origin/main');
  } else {
    await git.checkout(SYNC_BRANCH);
  }

  // Attempt merge
  console.log(`Merging origin/${UPSTREAM_BRANCH} into ${SYNC_BRANCH}...`);
  try {
    await git.merge([`origin/${UPSTREAM_BRANCH}`], { '--no-edit': null });
    console.log('Merge completed without conflicts.');
    return false;
  } catch (err) {
    if (!err.message?.includes('CONFLICT')) {
      throw err;
    }
    console.log('Merge has conflicts, auto-resolving...');
    // Accept upstream (theirs) for all conflicted files
    await git.raw(['checkout', '--theirs', '.']);
    await git.add('.');
    await git.commit(
      `Merge upstream (${UPSTREAM_REPO}@${UPSTREAM_BRANCH}) into sync`,
      { '--no-edit': null }
    );
    console.log('Conflicts resolved.');
    return true;
  }
}

async function getChangedFiles() {
  const diff = await git.diff(['--name-only', '--diff-filter=ACMR', 'HEAD~1', 'HEAD', '--', 'src/**/*.md']);
  const files = diff.split('\n').filter(Boolean);
  console.log(`Found ${files.length} changed markdown files.`);
  return files;
}

async function translateContent(englishContent, conventions) {
  const response = await ai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: conventions,
      },
      {
        role: 'user',
        content:
          'Translate the following Vue.js documentation markdown from English to Chinese. ' +
          'Follow the translation conventions strictly. ' +
          'Preserve ALL markdown formatting, code blocks, frontmatter, and links exactly. ' +
          'Only translate the natural language text. ' +
          'Keep code comments in code blocks as-is unless they are documentation prose. ' +
          'Output ONLY the translated content, no explanations.\n\n' +
          englishContent,
      },
    ],
  });

  let text = response.choices?.[0]?.message?.content || '';
  // Strip markdown code fences if the model wraps its output
  text = text.replace(/^```(?:markdown)?\n/, '').replace(/\n```$/, '');
  return text;
}

async function translateFiles(files) {
  const conventionsPath = resolve(ROOT, '.claude/skills/vuejs-docs-zh-cn/SKILL.md');
  const conventions = await readFile(conventionsPath, 'utf-8');

  let translated = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = resolve(ROOT, file);
    let content;
    try {
      content = await readFile(filePath, 'utf-8');
    } catch {
      console.log(`  Skip (not found): ${file}`);
      continue;
    }

    if (content.trim().length < 10) {
      console.log(`  Skip (too short): ${file}`);
      continue;
    }

    console.log(`  Translating: ${file}`);
    try {
      const result = await translateContent(content, conventions);
      if (!result) {
        console.log(`    ERROR: empty response`);
        failed++;
        continue;
      }
      await writeFile(filePath, result, 'utf-8');
      translated++;
      console.log('    OK');
    } catch (err) {
      console.log(`    ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nTranslation complete: ${translated} succeeded, ${failed} failed`);
  return { translated, failed };
}

async function commitAndPush() {
  await git.add('.');
  const status = await git.status();

  if (status.staged.length === 0) {
    console.log('No changes to commit.');
    return false;
  }

  await git.commit('docs: translate upstream sync content to Chinese');
  await git.push('origin', `HEAD:${SYNC_BRANCH}`);
  console.log('Translations pushed.');
  return true;
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  await git.fetch('origin');

  const hadConflicts = await mergeUpstream();
  const changedFiles = await getChangedFiles();

  if (changedFiles.length === 0) {
    console.log('No content files changed. Done.');
    return;
  }

  const { translated } = await translateFiles(changedFiles);

  if (translated > 0) {
    await commitAndPush();
  } else {
    console.log('No successful translations. Skipping push.');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
