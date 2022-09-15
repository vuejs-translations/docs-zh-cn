const SimpleGit = require('simple-git');

module.exports.getLatestSyncHash = async function () {
  const git = SimpleGit();
  const history = await git.log();
  const latestSync = history.all.find(v => /^sync #\w{7}\w?\s?$/i.test(v.body))?.body?.trim();
  if (!latestSync) {
    throw new Error('No hash found. Are there any commit with `sync #hash` message in git history?');
  }
  // console.log(latestSync)
  return latestSync.match(/#(\w{7}\w?)/)[1];
};
