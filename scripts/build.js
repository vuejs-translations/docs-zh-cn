const vitpress = require('vitepress')
const path = require('path')
const chalk = require('chalk')

/** building instructions: 
 *
 * All the steps must be a function that returns Promise.
 * Ensure that no one step could block building.
 * you can manage them if order is required.
 */

const rewriteTitle = require('../src/.vitepress/rewrite-title')

async function runBuild() {
  try {
    await rewriteTitle()
    await vitpress.build(path.resolve(__dirname, '../src'))
    chalk.green('build success!')
  } catch(err) {
    console.error(chalk.red(`build error:\n`), err)
    process.exit(1)
  }
}

runBuild();