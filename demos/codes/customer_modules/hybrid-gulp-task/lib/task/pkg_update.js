const gulp = require('gulp')
const fs = require('fs')
const del = require('delete')
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
    let taskName = 'pkg_update',
        inited = false,
        distDir = cwd + '/_dist',
        distCodeDir = distDir + '/_default',
        releaseDir = distDir + '/_package/release',
        udpateDir = distDir + '/_package/update',
        distSVN = new SvnHelper({cwd: distDir}),
        codeSVN = new SvnHelper({cwd: cwd + '/_src'}),
        distCodeSVN = new SvnHelper({cwd: distCodeDir})

    function task() {
        if(!inited) {
            inited = true
            
            gulp.task(taskName, async function () {
                let basePackVersion,
                    updatePackVersion,
                    buildtime = new Date(),
                    codeInfo,
                    distVersion,
                    packInfo

                if(!fs.existsSync(distCodeDir)) {
                    console.log('编译目标目录不存在,首次打包必须是全量包,请使用pkg_release命令')
                    return
                }

                // 更新
                await distCodeSVN.update()
                // 获取最新版本
                codeInfo = await codeSVN.version()

                try {
                    // 获取基线包版本信息
                    basePackVersion = JSON.parse(fs.readFileSync(releaseDir+'/release_version.json').toString())
                } catch(e) {
                    // 无文件
                    basePackVersion = {last_code_version: 0, pack_by_version: 0}
                }

                try {
                    // 获取增量包最新版本信息
                    updatePackVersion = JSON.parse(fs.readFileSync(udpateDir+'/update_version.json').toString())
                } catch(e) {
                    updatePackVersion = {last_code_version: 0}
                }

                console.log(
                    `
                    代码最新版本 ${codeInfo.version}
                    基线包代码版本 ${basePackVersion.last_code_version}
                    增量包代码版本 ${updatePackVersion.last_code_version}
                    `.replace(/\s{20}/gim, '\r\n')
                )

                // 判断是否需要打包
                if(codeInfo.version == basePackVersion.last_code_version 
                    || codeInfo.version == updatePackVersion.last_code_version) {
                    console.log(' 无需打包...')
                    return
                }

                // 编译
                await compile.doCompile({path: distCodeDir})

                let viewVersionFile = distCodeDir+'/__js/common/version-info-h5.js'
                mkdirsSync(viewVersionFile.replace(/\/[\w-_]+(\.\w+)*$/, '/'))

                // 动态生成打包版本号，供app展示
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
                await distCodeSVN.commit(`pkg_update: compile by ${codeInfo.version}`)
                // 获取最新版本号
                distVersion = (await distCodeSVN.version()).version

                console.log(
                    `
                    当前编译版本 ${distVersion}
                    基线包编译版本 ${basePackVersion.pack_by_version}
                    `.replace(/\s{20}/gim, '\r\n')
                )

                // 获取基线版本和最新版本的文件差异 （需要从编译后代码中获取）
                let updateFiles = await distCodeSVN.diff(basePackVersion.pack_by_version, distVersion)
                if(!updateFiles || !updateFiles.length) {
                    console.log(' 无文件更新...')
                    return
                }
                
                // 过滤文件列表，忽略删除的文件
                let modifiedList = updateFiles.filter(f=>f.$.item != 'deleted' && f.$.kind == 'file').map(f=>f._.replace(/\\/g,'/'))

                // 创建临时文件夹,用于copy差异文件并打增量包
                let tempPath = udpateDir + `/temp/${format(buildtime, 'yyyyMMddHHmmss')}`
                mkdirsSync(tempPath)

                modifiedList.forEach(f=>{
                    let targetFile = tempPath + '/' + f
                    let targetFolder = targetFile.substring(0,targetFile.lastIndexOf('/'))
                    mkdirsSync(targetFolder)
                    fs.copyFileSync(distCodeDir + '/' + f, targetFile)
                })

                // 打包
                let packName = (output.pushfile || `${product}-app-update-${format(buildtime, 'yyyyMMddHHmmss')}-${codeInfo.version}_${distVersion}.zip`)
                await new Promise(function (resolve, reject) {
                    gulp.src(tempPath+'/**/*')
                        .pipe(zip(packName))
                        .pipe(gulp.dest(output.pushto))
                        .on('end', resolve)
                })

                // 删除临时目录
                del.sync(udpateDir + '/temp')

                // 获取编译后版本提交信息，用于获取当前打包用户信息
                packInfo = await distCodeSVN.version()
                
                // 生成版本记录文件
                fs.writeFileSync(
                    udpateDir+'/update_version.json',
                    `
                    {
                        "product": "${product}",
                        "last_code_version": ${codeInfo.version},
                        "code_author": "${codeInfo.author}",
                        "update_time": "${format(codeInfo.date, 'yyyy-MM-dd HH:mm:ss')}",
                        "pack_name": "${packName}",
                        "pack_by_version": ${distVersion},
                        "pack_author": "${packInfo.author}",
                        "pack_time": "${format(buildtime, 'yyyy-MM-dd HH:mm:ss')}"
                    }
                    `.replace(/\s{20}/gim, '\r\n')
                )

                // 如果需要备份，则将文件copy到当前文件夹的path下面
                if(output.backup) {
                    fs.copyFileSync(`${output.pushto}/${packName}`, `${udpateDir}/${packName}`)
                }

                // 提交打包后的文件和版本信息
                await distSVN.commit(`pkg_update: package by base version: ${basePackVersion.last_code_version} , last version: ${codeInfo.version}`)

                console.log('打包完成... 增量包：' + packName)
            })
        }
        return [taskName]
    }

    return {task}
}