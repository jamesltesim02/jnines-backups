/**
* 页面中的依赖资源类
* 主要表示js和css
*/
class Resource {

    /**
    * 构造方法
    */
    constructor(url) {
        // 当前资源的地址
        this.url = url
        // 当前资源的引入地址
        this.distUrl =  url
        // 是否是模块化代码依赖
        this.isModule = false

        // 如果url以@module开头的地址，则表示为依赖的模块化代码
        if(url.indexOf('@module/') === 0) {
            this.isModule = true
            // 设置编译后的引用路径
            this.distUrl = url.replace('@module/', `../../${Resource.MODULE_DIR}/`)
        } 
    }

    /**
    * 将资源转为字符串
    */
    toString() {
        return JSON.stringify(this)
    }
}

// 模块化依赖的静态资源保存位置常量
Resource.MODULE_DIR = '__modules'

module.exports =  Resource