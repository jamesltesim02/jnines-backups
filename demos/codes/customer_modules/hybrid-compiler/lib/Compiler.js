const FileOperator = require('./FileOperator')
const Container = require('./Container')
const Template = require('./Template')
const Fragement = require('./Fragement')

/**
 * 编译工具类
 */
module.exports = class Compiler {

    constructor({template, target}) {
		this.initialed = false
        this.template = template
        this.target = target
    }

    /**
     * 初始化Compiler，在第一次被调用compile时才初始化
     * @param enc 
     */
    _init(cwd,enc) {
        // 创建file operator
        this.fileOperator = new FileOperator({
			enc: enc,
            cwd: cwd,
            target: this.target
        })
        // 创建container
        this.container = new Container(this.fileOperator)
        
		// 加载template
        this._loadTemplate()
        // 设置为已经初始化状态
		this.initialed = true
    }

    /**
     * 编译页面文件
     * @param content 
     *          文件内容
     * @param enc
     *          编码格式 
     */
    compile({url, content, enc, cwd}) {
    	if(!this.initialed) {
    		this._init(cwd,enc)
        }

        // 创建页面片段对象
        let fragement = new Fragement({url, content, container: this.container})
        // 调用Template fill页面内容
        return this.template.fillTemplate(fragement)
    }

    /**
     * 加载template文件
     */
    _loadTemplate() {
        // 创建Template对象
        this.template = new Template({
            template: this.template,
            container: this.container,
            content: this.fileOperator.loadComponentContent(this.template)
        })
    }
}