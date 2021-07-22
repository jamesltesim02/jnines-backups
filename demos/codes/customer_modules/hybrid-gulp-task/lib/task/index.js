
module.exports = function ({
    product,
    template,
    pattern,
    ignore,
    output,
    cwd
}) {
    // 编译对象 可将代码编译成浏览器可执行效果
    let compile = require('./compile')({
        template, 
        pattern, 
        ignore, 
        output
    }),
    // 获取svn信息并输出到代码指定目录
    svninfo = require('./svninfo')({
        cwd,
        output
    })

    return {
        // 开发编译任务
        dev: require('./dev')({
            pattern,
            compile,
            svninfo
        }),
        // 测试包打包任务
        pkg_debug: require('./pkg_debug')({
            product,
            pattern,
            output,
            compile,
            svninfo
        }),
        // 全量包打包任务
        pkg_release: require('./pkg_release')({
            product, 
            pattern,
            output,
            cwd,
            compile
        }),
        // 增量包打包任务
        pkg_update: require('./pkg_update')({
            product, 
            pattern,
            output,
            cwd,
            compile
        })
    }
}