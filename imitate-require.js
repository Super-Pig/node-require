const fs = require('fs')
const path = require('path')
const vm = require('vm')

function Module(id) {
  this.id = id;
  this.exports = {};
}

Module.wrapper = [
  "(function(exports, require, module, __filename, __dirname) {",
  "})"
]


Module._extensions = {
  '.js'(module) {
    let content = fs.readFileSync(module.id, 'utf-8')

    content = Module.wrapper[0] + content + Module.wrapper[1]

    const compileFn = vm.runInNewContext(content)

    const { exports } = module
    const dirname = path.dirname(module.id)
    const filename = module.id

    compileFn.call(exports, exports, myRequire, module, filename, dirname)
  },
  '.json'(module) { 
    const content = fs.readFileSync(module.id, 'utf-8')

    module.exports = JSON.parse(content)
  }
}

Module.prototype.load = function () {
  let extname = path.extname(this.id)

  Module._extensions[extname](this)
}

Module._resolveFilename = function (filename) {
  const absPath = path.resolve(__dirname, filename)

  // 判断当前路径对应的内容是否存在
  if (fs.existsSync(absPath)) {
    return absPath
  } else {
    // 文件定位
    let suffix = Object.keys(Module._extensions)

    for (let i = 0; i < suffix.length; i++) {
      let newPath = absPath + suffix[i]

      if (fs.existsSync(newPath)) {
        return newPath
      }
    }
  }

  throw new Error(`${filename} is not exists`)
}

Module._cache = {}

function myRequire(filename) {
  // 1. 获取绝对路径
  const mPath = Module._resolveFilename(filename)

  // 2. 缓存优先
  let cacheModule = Module._cache[mPath]

  if (cacheModule) {
    return cacheModule.exports
  }

  // 3. 创建空对象，加载目标模块
  let module = new Module(mPath)

  // 4. 缓存已加载过的模块
  Module._cache[mPath] = module

  // 5. 执行加载（编译执行）
  module.load()

  // 6. 返回数据
  return module.exports
}

let obj = myRequire('./m')
let data = myRequire('./data')

console.log(obj)
console.log(data)