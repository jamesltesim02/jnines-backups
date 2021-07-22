const fs = require('fs')
const mkdirsSync = require('mkdirs')
const Resource = require('./Resource')

/**
 * 用于根据组件路径加载文件内容的加载器
 */
module.exports = class FileOperator {
	
	/**
	 * 构造函数
	 */
	constructor({cwd, enc, target}) {
		this.cwd = cwd
		this.enc = enc
		this.target = target
	}

	/**
	 * 根据地址加载组件内容为字符串
	 */
	loadComponentContent(path) {

		// 如果url以@module开头的地址，则表示为依赖的模块化代码
		if(path.indexOf('@module/') === 0) {
			path = path.replace('@module/', '/node_modules/')
		} else {
			path = '/_src/' + path
		}

		return new Buffer(fs.readFileSync(this.cwd + path), this.enc)
	}

	/**
	 * 复制静态资源到编译目录
	 */
	copyModuleResource(resource) {
		let fromPath = this.cwd + resource.url.replace('@module/', '/node_modules/'),
		toPath = this.target + resource.url.replace('@module/', `/${Resource.MODULE_DIR}/`)

		// 创建目标目录
		mkdirsSync(toPath.replace(/\/[\w-_]+(\.\w+)*$/, '/'))

		// 复制模块化的资源文件
		fs.copyFileSync(fromPath, toPath)
	}
}