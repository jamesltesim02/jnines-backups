const cheerio = require('cheerio')

/**
 * 表示组件的类
 */
module.exports =  class Component {
    /**
	 * 构造函数
	 */
	constructor({url, content, container}) {
		// 依赖的子组件容器
		this.components = []
		this.allComponents = []
		// 组件和资源管理的上下文对象
		this.container = container
		this.content = content

		this.$ = cheerio.load(content,{decodeEntities: false})

		this._init()
		this._initComponents()
    }
    
    /**
	 * 初始化组件
	 */
	_init() {
        let contentTmplate = this.$('template')
        if(contentTmplate && contentTmplate.length) {
            this.id = contentTmplate[0].attribs.id
            this.template = contentTmplate.html()
        }

		this._initScripts()
		this._initStyles()
	}

	/**
	 * 初始化组件中依赖的script
	 */
	_initScripts() {
		this.inlineScripts = ''
		this.externalScripts = []

		// 获取页面中的内部script
		let inline = this.$('script:not([src])')
		if(inline && inline.length) {
			this.inlineScripts = Array.prototype.map.call(inline, v=>v.children[0].data).join('')
		}
		
		// 获取页面中的外部script，有src表示外部
		let external = this.$('script[src]')
		if(external && external.length) {
			Array.prototype.forEach.call(external, v=>{
				this.externalScripts.push(this.container.getResource('script', v.attribs.src))
			})
		}
	}

	/**
	 * 的初始化组件中依赖的style
	 */
	_initStyles() {
		this.inlineStyles = ''
		this.externalStyles = []

		// 获取页面中的内部样式代码
		let inline = this.$('style')
		if(inline && inline.length) {
			this.inlineStyles = Array.prototype.map.call(inline, v=>v.children[0].data).join('')
		}

		// 获取外部的样式文件
		let external = this.$('link[rel="stylesheet"]')
		if(external && external.length) {
			Array.prototype.forEach.call(external, v=>{
				this.externalStyles.push(this.container.getResource('style', v.attribs.href))
			})
		}
    }
    
    /**
	 * 初始化组件中依赖的组件列表
	 */
	_initComponents() {
		let compDoms = this.$('component')
		if(!compDoms || !compDoms.length) {
			return
		}
		Array.prototype.forEach.call(compDoms, v=>{
			this.components.push(this.container.getComponent(v.attribs.src))
		})
	}

	/**
	 * 获取组件的内部js代码，包括子组件的js代码，拼接成字符串
	 */
	getInlineScripts() {
		
		// 是否已经构造过组件的内部js代码，如果是则直接返回
		if(this.parsedAllInlineScripts) {
			return this.allInlineScripts
		}

		// 获取当前组件的内部js代码
		this.allInlineScripts = this.inlineScripts

		// 获取所有子组件内部js代码
		let components = this.getComponents()
		if(components && components.length) {
			this.allInlineScripts = components.map(v=>v.inlineScripts).join('') + this.inlineScripts
		}

		this.parsedAllInlineScripts = true

		return this.allInlineScripts
	}

	/**
	 * 获取组件的内部样式代码，包括拼装子组件的样式代码
	 */
	getInlineStyles() {

		if(this.parsedAllInlineStyles) {
			return this.allInlineStyles
		}

		// 获取当前组件的内部样式代码
		this.allInlineStyles = this.inlineStyles
		
		// 获取所有子组件内部样式代码
		let components = this.getComponents()
		if(components && components.length) {
			this.allInlineStyles = components.map(v=>v.inlineStyles).join('') + this.inlineStyles
		}

		this.parsedAllInlineStyles = true

		return this.allInlineStyles
	}

	/**
	 * 获取外部js文件列表，包括子组件
	 */
	getExternalScripts() {
		let newSet = [...this.externalScripts]
		let components = this.getComponents()

		if(components && components.length) {
			components.forEach(v=>{
				newSet.push(...v.externalScripts)
			})
		}

		return [...new Set(newSet)]
	}

	/**
	 * 获取外部css文件列表，包括子组件
	 */
	getExternalStyles() {
		let newSet = [...this.externalStyles]
		let components = this.getComponents()

		if(components && components.length) {
			components.forEach(v=>{
                newSet.push(...v.externalStyles)
			})
		}

		return [...new Set(newSet)]
	}

	/**
	 * 获取子组件列表，包含所有层级的组件依赖并且会去重复
	 */
	getComponents() {
		// 如果已经加载过所有子组件，则直接返回已经加载过的结果
		if(this.compGeted) {
			return this.allComponents
		}

		// 设置状态为已经加载过
		this.compGeted = true
		
		// 如果没有子组件直接返回undefined
		if(!this.components || !this.components.length) {
			return
		}

		// 创建所有子组件的set容器
		let newComps = []
		// 迭代获取所有子组件依赖的组件
		this.components.forEach(v=>{
			let comps = v.getComponents()
			comps && newComps.push(...comps)
		})
		
		newComps.push(...this.components)

		// 保存所有子组件
		this.allComponents = [...new Set(newComps)]

		return this.allComponents
    }

	/**
	 * 组件转为字符串，添加为template标签
	 */
	toString() {
		return `<template id="${this.id}">${this.template}</template>\n`
    }
    
    /**
     * 获取模板字符串，包含所有子组件
     */
    getTemplates() {
		if(this.parsedAllTemplates) {
			return this.allTemplates
		}

		this.allTemplates = this.toString()

        let components = this.getComponents()
		if(components && components.length) {
			this.allTemplates = components.map(v=>v.toString()).join('') + this.allTemplates
		}

		this.parsedAllTemplates = true

		return this.allTemplates
    }
}