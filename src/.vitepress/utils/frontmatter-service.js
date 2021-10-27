const fs = require('fs')
const matter = require('gray-matter')
const { extend, isEmpty: _isEmpty } = require('lodash')

class FrontMatterService {
  constructor() {}

  /** @param {Record<string, any>} obj */
  __print(obj) {
    console.log(JSON.stringify(obj, null, 2))
  }

  /** @param {string} filePath */
  open(filePath) {
    this.filePath = filePath
    this.file = fs.readFileSync(filePath)
    this.matter = matter(String(this.file))
    return this
  }

  isEmpty() {
    return _isEmpty(this.matter.data)
  }

  /** @param{(data: string) => void} callback */
  readFile(callback) {
    callback(String(this.file))
    return this
  }

  /** @param {string} string */
  show(key) {
    let output = flag ? this.matter[key] : this.matter
    this.__print(output)
    return this
  }

  /**
   * @param {string} key
   * @param {string} value
   * */
  set(key, value) {
    this.matter.data[key] = value
    return this
  }

  /** @param {Record<string, any>} src */
  extend(src) {
    extend(this.matter.data, src)
    return this
  }

  save() {
    let matterStringifyData = this.matter.stringify()
    fs.writeFile(this.filePath, matterStringifyData, (err) => {
      if (err) {
        console.warn(`${this.filePath} -- Saving file with matter failed !!`)
        return
      }
    })
  }
}

module.exports = new FrontMatterService()