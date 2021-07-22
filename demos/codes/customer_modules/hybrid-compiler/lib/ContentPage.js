const cheerio = require('cheerio')
const Resource = require('./Resource')

/**
 * 合并后的新页面
 */
module.exports = class ContentPage {

    /**
     * 构造函数
     * 
     * @param template 
     * @param fragement 
     */
    constructor(template,fragement) {
        
        this.template = template
        this.fragement = fragement
        this.conf = this.template.conf

        // 每次都重新构造template对象，因为每次compile都会修改结构
        this.$ = cheerio.load(this.template.content, {decodeEntities: false})

        // 插入对应代码到指定位置
        this._fillExternalStyles()
        this._fillInlineStyles()
        this._fillTemplates()
        this._fillExternalScripts()
        this._fillInlineScripts()

        // 删除template中的component代码
        this.$("component").remove()
    }

    /**
     * 插入外部样式文件列表
     */
    _fillExternalStyles () {
        // 获取模板中的外部样式文件列表,添加content中的外部样式文件列表
        let exStyles = [...new Set([...this.template.getExternalStyles(),...this.fragement.getExternalStyles()])]
        // 将样式文件列表转为引入字符串
        let exStyleCodes = exStyles.map(v=>{
            return v.toString()
        }).join('')
        // 插入到模板中
        this.$(this.conf.exStyleKey).replaceWith(exStyleCodes)

        // 替换template中的依赖模块化样式文件路径
		let external = this.$('link[rel="stylesheet"][href^="@module/"]')
		if(external && external.length) {
			Array.prototype.forEach.call(external, v=>{
                v.attribs.href = v.attribs.href.replace('@module/', `../../${Resource.MODULE_DIR}/`)
			})
        }
    }

    /**
     * 插入内部样式代码
     */
    _fillInlineStyles () {
        let inlineStyles = this.template.getInlineStyles() + this.fragement.getInlineStyles()
        inlineStyles = inlineStyles ? `<style>${inlineStyles}</style>` : ''
        this.$(this.conf.styleKey).replaceWith(inlineStyles)
    }

    /**
     * 插入组件模板代码
     */
    _fillTemplates() {
        let temps = this.template.getTemplates()
        temps += this.fragement.getTemplates()

        this.$(this.conf.conentKey).replaceWith(temps)
    }
    
    /**
     * 插入外部js文件列表
     */
    _fillExternalScripts() {
        // 获取模板中的外部JS文件列表,添加content中的外部JS文件列表
        let exScripts = [...new Set([...this.template.getExternalScripts(),...this.fragement.getExternalScripts()])]
        // 将JS文件列表转为引入字符串
        let exScriptCodes = exScripts.map(v=>{
            return v.toString()
        }).join('')
        // 插入到模板中
        this.$(this.conf.exScriptKey).replaceWith(exScriptCodes)

        // 替换template中对模块化依赖的js文件路径
		let external = this.$('script[src^="@module/"]')
		if(external && external.length) {
			Array.prototype.forEach.call(external, v=>{
                v.attribs.src = v.attribs.src.replace('@module/', `../../${Resource.MODULE_DIR}/`)
			})
		}
    }
    
    /**
     * 插入内部JS代码
     */
    _fillInlineScripts() {
        let inlineScripts = this.template.getInlineScripts() + this.fragement.getInlineScripts()
        inlineScripts = inlineScripts ? `<script>${inlineScripts}</script>` : ''
        this.$(this.conf.scriptKey).replaceWith(inlineScripts)
    }

    /**
     * 将合并后的页面转为字符串
     */
    toString() {
        return this.$.html()
    }
}