/**
 * usage: pnpm run sync:pr
 *
 * generate a sync PR's title & content base on our rules.
 * make sure to double check the generated content.
 */
const git = require('simple-git')();
const { getLatestSyncHash } = require('./utils');

(async () => {
  let latestUpstreamHash = await git.show(['-s', '--format="%h"', 'origin/upstream']);
  latestUpstreamHash = latestUpstreamHash.trim().replace(/"/g, '');
  const latestSyncHash = await getLatestSyncHash();

  console.log(`
--- PR Title ---:
Sync #${latestUpstreamHash}

--- PR Content ---:
## Description of Problem

https://github.com/vuejs/docs/compare/${latestSyncHash}...${latestUpstreamHash}

`);
})();
