const { Command } = require('commander');
const SimpleGit = require('simple-git');
const program = new Command();
const open = require('open');

async function getLatestSyncHash () {
  const git = SimpleGit();
  const history = await git.log(['origin/main']);
  const latestSync = history.all.find(v => /^sync #\w{7}\w?\s?$/i.test(v.body))?.body?.trim();
  // console.log(history.all[0])
  if (!latestSync) {
    throw new Error('No hash found. Are there any commit with `sync #hash` message in git history?');
  }
  // console.log(latestSync)
  return latestSync.match(/#(\w{7}\w?)/)[1];
}

async function getLatestUpstreamHash () {
  const git = SimpleGit();
  const latestUpstreamHash = await git.show(['-s', '--format="%h"', 'origin/upstream']);
  return latestUpstreamHash.trim().replace(/"/g, '');
}

program
  .name('sync')
  .description('The sync helper CLI');

program.command('compare')
  .description('Open the github website to compare diffs to sync.')
  .action(async () => {
    open(`https://github.com/vuejs/docs/compare/${await getLatestSyncHash()}...${await getLatestUpstreamHash()}`);
  });

program.command('pr')
  .description('Generate sync PR\'s title and content.')
  .option('-o, --open', 'directly open link to create pr (sync branch->main branch)')
  .action(async (options) => {
    const latestUpstreamHash = await getLatestUpstreamHash();
    const latestSyncHash = await getLatestSyncHash();

    const title = `Sync #${latestUpstreamHash}`;
    const body = `## Description of Problem

https://github.com/vuejs/docs/compare/${latestSyncHash}...${latestUpstreamHash}
`;

    console.log(`
--- PR Title ---:
${title}

--- PR Content ---:
${body}`);

    if (options.open) {
      open(`https://github.com/vuejs-translations/docs-zh-cn/compare/main...sync?quick_pull=1&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=${encodeURIComponent('从英文版同步,请使用 merge commit 合并')}`);
    }
  });

program.parse();
