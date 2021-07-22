const ResourceTypes = require('./ResourceTypes')
const Component = require('./Component')

/**
 * 组件和资源的管理容器
 */
module.exports = class Container {
	/**
	 * 构造函数，初始化容器
	 */ 
	constructor(fileOperator) {
		this.fileOperator = fileOperator
		this.map = new Map()
	}

	/**
	 * 获取依赖的静态资源文件
	 */
	getResource(type, url) {
		// 获取缓存
		let resource = this.map.get(url)
		if(resource) {
			return resource
		}

		// 创建对象
		resource = new ResourceTypes[type](url)
		this.map.set(url,resource)

		// 如果是模块化依赖，则copy文件
		if(resource.isModule) {
			this.fileOperator.copyModuleResource(resource)
		}

		return resource
	}

	/**
     * 获取组件对象
     */
	getComponent(url) {
        let component = this.map.get(url)
		if(!component) {
			// 加载组件内容
			let content = this.fileOperator.loadComponentContent(url)
			// 创建组件对象
			component = new Component({url, content, container: this})
			// 保存到容器中
			this.map.set(url, component)
		}
		return component
	}
}
