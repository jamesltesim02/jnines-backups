const Component = require('./Component')
const ContentPage = require('./ContentPage')

/**
 * 模板中的占位符默认配置，可覆盖
 */
const TEMPLATE_KEY = {
	styleKey: 'page-style',
	conentKey: 'page-content',
	scriptKey: 'page-script',
	exScriptKey: 'external-script',
	exStyleKey: 'external-style'
}

/**
 * 表示全局模板的类，根据模板编译所有的页面
 */
module.exports = class Template extends Component {

	/**
	 * 构造函数
	 */
	constructor({template, content, container}) {
		super({url: template.url, content, container})
		if(typeof(template) === "string") {
			template = {url: template}
		}
		this.conf = Object.assign({}, TEMPLATE_KEY, template) 
	}

	/**
	 * 重写初始化script函数，template无需获取出来
	 */
	_initScripts() {
		this.inlineScripts = ''
		this.externalScripts = []

		// 获取页面中的外部script，有src表示外部
		let external = this.$('script[src^="@module/"]')
		if(external && external.length) {
			Array.prototype.forEach.call(external, v=>{
				this.container.getResource('script', v.attribs.src)
			})
		}
	}

	/**
	 * template无需获取style
	 */
	_initStyles() {
		this.inlineStyles = ''
		this.externalStyles = []

		// 获取外部的样式文件
		let external = this.$('link[rel="stylesheet"][href^="@module/"]')
		if(external && external.length) {
			Array.prototype.forEach.call(external, v=>{
				this.externalStyles.push(this.container.getResource('style', v.attribs.href))
			})
		}
	}
	
	/**
	 * template 无需转出到字符串
	 */
	toString() {
		return ''
	}
	
	/**
	 * 将content对象按照当前模板进行填充，返回编译后的完整html字符串
	 */
	fillTemplate(fragement) {
		return new ContentPage(this, fragement).toString()
	}

}
