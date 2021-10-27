const path = require('path')
const fsp = require('fs').promises
const matterService = require('../utils/frontmatter-service')
const vitepressWorkspacePath = path.resolve(__dirname, '..', '..')

/**
 * Why this?
 * 
 * Because we have a special header syntax across translations like {#xxx},
 * and the main header text of each page will display on browser tab,
 * we need to run this script on building,
 * in order to rewrite the page title in frontmatter,
*/

const h1MdRegExp = /^#\s+(.+)\s+(\{#([\w-]+)\})$/
/** 在此书写所有文章所在的目录名 */

const rewriteMarkdownTitle = (filePath) => {
  const matter = matterService.open(filePath)
  const lines = String(matter.file).split(/\r?\n/)
  const h1Line = lines.find((line) => h1MdRegExp.test(line))
  if (!h1Line) return

  const title = h1MdRegExp.exec(h1Line)[1]
  matter.set('title', title).save()
}

const ergodicDirectory = async (dirPath) => {
  try {
    const files = await fsp.readdir(dirPath)
    for (let i = 0; i < files.length; i++) {
      const file = files[i],
        filePath = path.join(dirPath, file)
      const stats = await fsp.stat(filePath)
      if (stats.isFile()) {
        if (filePath.split('.').pop().toLowerCase() === 'md') {
          rewriteMarkdownTitle(filePath)
        }
      } else if (stats.isDirectory()) {
        await ergodicDirectory(filePath)
      }
    }
  } catch (err) {
    console.warn(
      `vite-docs-cn: failed to rewrite frontmatter for titles.\n ${err}!`
    )
  }
}

module.exports = () => {
  ergodicDirectory(vitepressWorkspacePath)
}
