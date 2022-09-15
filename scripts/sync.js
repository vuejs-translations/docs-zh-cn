/**
 * usage: pnpm run sync:viewdiff
 *
 * find the latest synced commit hash from local git by `sync #hash` pattern,
 * and open a browser tab of github.com/vuejs/docs,
 * with the compare between this hash and latest master branch.
 * save a little bit time between finding it manually.
 *
 * https://github.com/vuejs/docs-next-zh-cn/pull/728
 */
const open = require('open');
const { getLatestSyncHash } = require('./utils');

(async () => {
  const latestSyncHash = await getLatestSyncHash();
  open(`https://github.com/vuejs/docs/compare/${latestSyncHash}...main`);
})();
