/**
 * usage: pnpm run sync:pr
 *
 * generate a sync PR's title & content base on our rules.
 * also open a url to create the PR base on sync branch.
 * make sure to double-check the generated content.
 */
const git = require('simple-git')();
const open = require('open');
const { getLatestSyncHash } = require('./utils');

(async () => {
  let latestUpstreamHash = await git.show(['-s', '--format="%h"', 'origin/upstream']);
  latestUpstreamHash = latestUpstreamHash.trim().replace(/"/g, '');
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

  open(`https://github.com/vuejs-translations/docs-zh-cn/compare/main...sync?quick_pull=1&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`);
})();
