const Resource = require('./Resource')
/**
 * 静态资源文件实现类列表
 * 用于在Container中的简单工厂模式getResource中提供key到类型的配置
 */
module.exports =  ResourceTypes = {
	/**
	 * 表示js文件的类
	 */
	'script': class Script extends Resource {
		/**
		 * 将资源转为字符串，返回引入所需的标签代码
		 */
		toString() {
			return `<script src="${this.distUrl}"></script>\n`
		}
	},
	/**
	 * 表示样式文件的类
	 */
	'style': class Style extends Resource {
		/**
		 * 将资源转为字符串，返回引入所需的标签代码
		 */
		toString() {
			return `<link rel="stylesheet" href="${this.distUrl}">\n`
		}
	}
}