/**
 * usage: npm run sync
 *
 * find the latest synced commit hash from local git by `sync #hash` pattern,
 * and open a browser tab of github.com/vuejs/docs,
 * with the compare between this hash and latest master branch.
 * save a little bit time between finding it manually.
 *
 * https://github.com/vuejs/docs-next-zh-cn/pull/728
 */
const git = require('simple-git')();
const open = require('open');

(async () => {
  const history = await git.log()
  const latestSync = history.all.find(v => /^sync #\w{7}\s.+$/i.test(v.message))?.message
  if (!latestSync) {
    console.log('No hash found. Are there any commit with `sync #hash` message in git history?');
    return;
  }
  const latestSyncHash = latestSync.match(/#(\w+)\s/)[1]
  open(`https://github.com/vuejs/docs/compare/${latestSyncHash}...master`)
})()
