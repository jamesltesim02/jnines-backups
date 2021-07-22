const path = require('path')
const fs = require('fs')
const Terser = require("terser")
const crypto = require("crypto")
const babel = require("@babel/core")

const isProd = process.env.NODE_ENV === 'production'

/**
 * 入口js构造插件
 */
class BuildWidgetLoaderPlugin {

  /**
   * 初始配置信息
   */
  options = {
    /**
     * 校验静态文件是否需要导入到模板文件中
     */
    staticCheck: () => true,
    /**
     * loader模板地址
     */
    template: 'public/widgetloader.js',
    /**
     * 输出文件名称
     */
    filename: 'widgetloader.js',
    /**
     * 配置信息
     */
    config: {},
    /**
     * 需要导入的入口名列表
     */
    chunks: ['widget']
  }

  /**
   * 构造函数
   *
   * @param {object} options 配置参数
   *  {
   *    template: loader模板地址
   *    filename: 输出文件名称
   *  }
   */
  constructor (options) {
    this.options = {
      ...this.options,
      ...options
    }
  }

  /**
   * 根据编译结果生成入口js文件
   * 
   * @param {object} compiler 当前webpack编译器对象
   * @param {object} stats 当前编译任务内容 
   */
  async buildEntry (
    compiler,
    compilation
  ) {
    const {
      template,
      filename
    } = this.options

    // 构造模板文件路径
    const sourcePath = path.resolve(compiler.context, template)

    // 判断模板文件是否存在
    if (!fs.existsSync(sourcePath)) {
      const error = new Error(`Widget loader file [${sourcePath}] not found.`)
      compilation.errors.push(error)
      return Promise.reject(error)
    }

    // 过滤出需要用到的静态文件
    const statics = { js: [], css: [] }
    const extensionRegexp = /\.(css|js|mjs)(\?|$)/;

    // 根据当前依赖的entry过滤出需要引入的文件
    this.options.chunks.forEach(entryName => {
      const entryFiles = compilation.entrypoints.get(entryName).getFiles();
      entryFiles.forEach(entryPointPublicPath => {
        const extMatch = extensionRegexp.exec(entryPointPublicPath);
        // Skip if the public path is not a .css, .mjs or .js file
        if (!extMatch) {
          return;
        }
        // ext will contain .js or .css, because .mjs recognizes as .js
        const ext = extMatch[1] === 'mjs' ? 'js' : extMatch[1];
        statics[ext].push(entryPointPublicPath);
      })
    })

    // 读取widgetloader文件模板
    const source = fs.readFileSync(sourcePath)
    // 替换编译后的配置及静态文件路径
    let content = source.toString().replace(
      '__env_variables__',
      JSON.stringify({ statics })
    )

    // 使用babel进行编译
    try {
      content = babel.transformSync(
        content,
        { "presets": ["@babel/env"] }
      ).code
    } catch(err) {
      console.error(err);
      compilation.errors.push(err)
      return Promise.reject()
    }
    
    // 压缩代码: 只有做生产环境编译时才压缩
    if (isProd) {
      const minifiedContent = Terser.minify(content)
      if (minifiedContent.error) {
        compilation.errors.push(minifiedContent.error)
        return Promise.reject()
      }

      content = minifiedContent.code
    }

    // 构造输出文件名称
    const assetName = (
      filename.replace(
        new RegExp(
          [
            '\\[name\\]',
            '\\[(content)?hash(\\:\\d)?\\]'
          ].join('|'),
          'gi'
        ),
        matched => {
          // 替换 [name] 为文件名
          if (matched === '[name]') {
            return template.replace(
              /(^.+\/)|(\..+?$)/gi,
              ''
            )
          }

          if (!matched.includes('hash')) {
            return
          }

          // 获取内容hash
          const contenthash = (
            crypto.createHash('md4')
              .update(content)
              .digest('hex')
          )
          // 针对 [hash:n] 或 [contenthash:n] 进行长度处理
          if (matched.includes(':')) {
            const hlength = +matched.split(/[\[\]\:]/g)[2]
            if (
              hlength > 5
              &&
              hlength <= contenthash.length
            ) {
              return contenthash.substring(0, hlength)
            }
          }

          return contenthash
        }
      )
    )

    // 更新资源文件
    compilation.assets[assetName] = {
      source: () => content,
      size: () => content.length
    }

    return Promise.resolve()
  }

  /**
   * 插件入口
   *
   * @param {object} compiler webpack编译器对象
   */
  apply (compiler) {
    // 注册钩子: 源生成完成，输出之前
    compiler.hooks.emit.tapPromise(
      'BuildWidgetLoaderPlugin',
      compilation => this.buildEntry(compiler, compilation)
    )
  }
}

module.exports = BuildWidgetLoaderPlugin
