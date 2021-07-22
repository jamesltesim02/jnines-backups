const gulp = require('gulp')
const fs = require('fs')
const zip = require('gulp-zip')
const mkdirsSync = require('mkdirs')
const SvnHelper = require('svn-helper')
const format = require('simple-date-format')

module.exports = function ({
    product,
    pattern,
    output,
    cwd,
    compile
}) {
    let taskName = 'pkg_release',
        inited = false,
        codeSVN = new SvnHelper({cwd: cwd + '/_src'}),
        distDir = cwd + '/_dist',
        distCodeDir = distDir + '/_default',
        releaseDir = distDir + '/_package/release',
        distSVN = new SvnHelper({cwd: distDir}),
        distCodeSVN = new SvnHelper({cwd: distCodeDir}),
        buildtime = new Date(),
        codeInfo = {version: 0, date: new Date()},
        distVersion,
        packInfo

    function task() {
        if(!inited) {
            inited = true
            
            gulp.task(taskName, async function () {
                // 获取最新版本
                codeInfo = await codeSVN.version()

                if(fs.existsSync(distCodeDir)) {
                    // 更新
                    await distCodeSVN.update()

                    // 获取最后打包版本号
                    let basePackVersion = {last_code_version: 0}

                    try {
                        basePackVersion = JSON.parse(fs.readFileSync(releaseDir+'/release_version.json').toString())
                    } catch(e) {
                        // 无文件
                    }

                    console.log(
                        `
                        代码最新版本 ${codeInfo.version}
                        基线包代码版本 ${basePackVersion.last_code_version}
                        `.replace(/\s{20}/gim, '\r\n')
                    )

                    // 判断是否需要打包
                    if(codeInfo.version == basePackVersion.last_code_version) {
                        console.log(' 无需打包...')
                        return
                    }
                } else {
                    mkdirsSync(distCodeDir)
                    await distSVN.commit('first pack,create dist _default folder')
                }

                // 编译
                await compile.doCompile({path: distCodeDir})

                // 将本次编译版本信息写入到编译目录
                let viewVersionFile = distCodeDir+'/__js/common/version-info-h5.js'
                mkdirsSync(viewVersionFile.replace(/\/[\w-_]+(\.\w+)*$/, '/'))
                fs.writeFileSync(
                    viewVersionFile,
                    `
                    window.VERSION_INFO_H5 = {
                        "version": "${format(new Date(codeInfo.date), 'yyyyMMddHHmmss')}-${codeInfo.version}",
                        "buildtime": "${format(buildtime, 'yyyy-MM-dd HH:mm:ss')}"
                    }
                    `.replace(/\s{20}/gim, '\r\n')
                )

                // 提交编译后的代码到svn,并获取提交后的版本号
                distVersion = await distCodeSVN.commit(`pkg_release: compile by ${codeInfo.version}`)

                // 打包
                let packName = (output.pushfile||`${product}-app-release-${format(buildtime, 'yyyyMMddHHmmss')}-${codeInfo.version}_${distVersion}.zip`)
                await new Promise(function (resolve, reject) {
                    gulp.src(distCodeDir + '/**/*')
                        .pipe(zip(packName))
                        .pipe(gulp.dest(output.pushto))
                        .on('end', resolve)
                })

                // 获取编译后版本提交信息，用于获取当前打包用户信息
                packInfo = await distCodeSVN.version()

                // 生成版本记录文件
                mkdirsSync(releaseDir)
                fs.writeFileSync(
                    releaseDir+'/release_version.json',
                    `
                    {
                        "product": "${product}",
                        "last_code_version": ${codeInfo.version},
                        "code_author": "${codeInfo.author}",
                        "update_time": "${format(codeInfo.date, 'yyyy-MM-dd HH:mm:ss')}",
                        "pack_by_version": ${distVersion},
                        "pack_author": "${packInfo.author}",
                        "pack_time": "${format(buildtime, 'yyyy-MM-dd HH:mm:ss')}"
                    }
                    `.replace(/\s{20}/gim, '\r\n')
                )

                // 如果需要备份，则将文件copy到当前文件夹的path下面
                if(output.backup) {
                    fs.copyFileSync(`${output.pushto}/${packName}`,`${releaseDir}/${(output.pushfile || packName)}`)
                }

                // 提交打包后的文件和版本信息
                await distSVN.commit(`pkg_release: package by code: ${codeInfo.version} compiled: ${distVersion}`)

                console.log('打包完成... 全量包：' + packName)
            })
        }
        return [taskName]
    }

    return {task}
}
