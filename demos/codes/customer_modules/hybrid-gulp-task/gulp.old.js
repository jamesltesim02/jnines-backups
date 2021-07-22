var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    zip = require('gulp-zip'),
    fs = require('fs'),
    del = require('delete'),
    
    mkdirsSync = require('mkdirs'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    
    compiler = require('hybrid-compiler'),
    SvnHelper = require('svn-helper'),
    format = require('simple-date-format'),

    appconfig = require('./appconfig.js'),
    output = appconfig.output[appconfig.env],
    input = appconfig.input,
    pattern = input.pattern,
    ignore = Object.assign(input.ignore.default || {}, input.ignore[appconfig.env]),
    tasks,
    _




tasks = ({


    'pkg_release': function () {
        let codeSVN = new SvnHelper({cwd: appconfig.svn.cwd + '/_src'}),
            distCodeSVN = new SvnHelper({cwd: output.codes}),
            distPackSVN = new SvnHelper({cwd: output.path}),
            buildtime = new Date(),
            codeInfo,
            distVersion,
            packInfo

        gulp.task('pkg_release', async function () {
            // 更新
            await distCodeSVN.update()
            // 获取最新版本
            codeInfo = await codeSVN.version()

            // 获取最后打包版本号
            let basePackVersion = {last_code_version: 0}

            try {
                basePackVersion = JSON.parse(fs.readFileSync(output.path+'/release_version.json').toString())
            } catch(e) {
                // 无文件
            }

            console.log(
                `
                代码最新版本 ${codeInfo.version}
                基线包代码版本 ${basePackVersion.last_code_version}
                `.replace(/\s{16}/gim, '\r\n')
            )

            // 判断是否需要打包
            if(codeInfo.version == basePackVersion.last_code_version) {
                console.log(' 无需打包...')
                return
            }

            // 编译
            await compile()

            // 动态生成打包版本号，供app展示
            fs.writeFileSync(
                output.codes+'/__js/common/version-info-h5.js',
                `
                window.VERSION_INFO_H5 = {
                    version: '${format(new Date(codeInfo.date), 'yyyyMMddHHmmss')}-${codeInfo.version}',
                    buildtime: '${format(buildtime, 'yyyy-MM-dd HH:mm:ss')}'
                }
                `.replace(/\s{16}/gim, '\r\n')
            )

            // 提交编译后的代码到svn,并获取提交后的版本号
            distVersion = await distCodeSVN.commit(`pkg_release: compile by ${codeInfo.version}`)

            // 打包
            let packName = (output.pushfile||`${appconfig.product}-app-release-${format(buildtime, 'yyyyMMddHHmmss')}-${codeInfo.version}_${distVersion}.zip`)
            await new Promise(function (resolve, reject) {
                gulp.src(output.codes + '/**/*')
                    .pipe(zip(packName))
                    .pipe(gulp.dest(output.pushto))
                    .on('end', resolve)
            })

            // 获取编译后版本提交信息，用于获取当前打包用户信息
            packInfo = await distCodeSVN.version()

            // 生成版本记录文件
            mkdirsSync(output.path)
            fs.writeFileSync(
                output.path+'/release_version.json',
                `
                {
                    'product': 'A01',
                    'last_code_version': ${codeInfo.version},
                    'code_author': '${codeInfo.author}',
                    'update_time': '${format(codeInfo.date, 'yyyy-MM-dd HH:mm:ss')}',
                    'pack_by_version': ${distVersion},
                    'pack_author': '${packInfo.author}',
                    'pack_time': '${format(buildtime, 'yyyy-MM-dd HH:mm:ss')}'
                }
                `.replace(/\s{16}/gim, '\r\n')
            )

            // 如果需要备份，则将文件copy到当前文件夹的path下面
            if(output.backup) {
                fs.copyFileSync(output.pushto + '/' + packName, output.path + '/' + (output.pushfile || packName))
            }

            // 提交打包后的文件和版本信息
            await distPackSVN.commit(`pkg_release: package by code: ${codeInfo.version} compiled: ${distVersion}`)

            console.log('打包完成... 全量包：' + packName)
        })

        return ['pkg_release']
    },
    'pkg_update': function () {
        let codeSVN = new SvnHelper({cwd: appconfig.svn.cwd + '/_src'}),
            distCodeSVN = new SvnHelper({cwd: output.codes}),
            distPackSVN = new SvnHelper({cwd: output.path}),
            buildtime = new Date(),
            codeInfo,
            distVersion,
            packInfo

        gulp.task('pkg_update', async function () {
            let basePackVersion = {last_code_version: 0},
                updatePackVersion = {last_code_version: 0}
            // 更新
            await distCodeSVN.update()
            // 获取最新版本
            codeInfo = await codeSVN.version()

            try {
                // 获取基线包版本信息
                basePackVersion = JSON.parse(fs.readFileSync(output.base+'/release_version.json').toString())
                // 获取增量包最新版本信息
                updatePackVersion = JSON.parse(fs.readFileSync(output.path+'/update_version.json').toString())
            } catch(e) {
                // 无文件
            }

            console.log(
                `
                代码最新版本 ${codeInfo.version}
                基线包代码版本 ${basePackVersion.last_code_version}
                增量包代码版本 ${updatePackVersion.last_code_version}
                `.replace(/\s{16}/gim, '\r\n')
            )

            // 判断是否需要打包
            if(codeInfo.version == basePackVersion.last_code_version 
                || codeInfo.version == updatePackVersion.last_code_version) {
                console.log(' 无需打包...')
                return
            }

            // 编译
            await compile()

            // 动态生成打包版本号，供app展示
            fs.writeFileSync(
                output.codes+'/__js/common/version-info-h5.js',
                `
                window.VERSION_INFO_H5 = {
                    version: '${format(new Date(codeInfo.date), 'yyyyMMddHHmmss')}-${codeInfo.version}',
                    buildtime: '${format(buildtime, 'yyyy-MM-dd HH:mm:ss')}'
                }
                `.replace(/\s{16}/gim, '\r\n')
            )

            // 提交编译后的代码到svn,并获取提交后的版本号
            await distCodeSVN.commit(`pkg_update: compile by ${codeInfo.version}`)
            // 获取最新版本号
            distVersion = (await distCodeSVN.version()).version

            console.log(
                `
                当前编译版本 ${distVersion}
                基线包编译版本 ${basePackVersion.pack_by_version}
                `.replace(/\s{16}/gim, '\r\n')
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
            let tempPath = output.path + `/temp/${format(buildtime, 'yyyyMMddHHmmss')}`
            mkdirsSync(tempPath)

            modifiedList.forEach(f=>{
                let targetFile = tempPath + (f.split('/_dist')[1])
                let targetFolder = targetFile.substring(0,targetFile.lastIndexOf('/'))
                mkdirsSync(targetFolder)
                fs.copyFileSync(f, targetFile)
            })

            // 打包
            let packName = (output.pushfile || `${appconfig.product}-app-update-${format(buildtime, 'yyyyMMddHHmmss')}-${codeInfo.version}_${distVersion}.zip`)
            await new Promise(function (resolve, reject) {
                gulp.src(tempPath+'/_default/**/*')
                    .pipe(zip(packName))
                    .pipe(gulp.dest(output.pushto))
                    .on('end', resolve)
            })

            del.sync(output.path + '/temp')

            // 获取编译后版本提交信息，用于获取当前打包用户信息
            packInfo = await distCodeSVN.version()
            // 生成版本记录文件
            fs.writeFileSync(
                output.path+'/update_version.json',
                `
                {
                    'product': 'A01',
                    'last_code_version': ${codeInfo.version},
                    'code_author': '${codeInfo.author}',
                    'update_time': '${format(codeInfo.date, 'yyyy-MM-dd HH:mm:ss')}',
                    'pack_name': '${packName}',
                    'pack_by_version': ${distVersion},
                    'pack_author': '${packInfo.author}',
                    'pack_time': '${format(buildtime, 'yyyy-MM-dd HH:mm:ss')}'
                }
                `.replace(/\s{16}/gim, '\r\n')
            )

            // 如果需要备份，则将文件copy到当前文件夹的path下面
            if(output.backup) {
                fs.copyFileSync(output.pushto + '/' + packName, output.path + '/' + packName)
            }

            // 提交打包后的文件和版本信息
            await distPackSVN.commit(`pkg_update: package by base version: ${basePackVersion.last_code_version} , last version: ${codeInfo.version}`)

            console.log('打包完成... 增量包：' + packName)
        })

        return ['pkg_update']
    }
})[appconfig.env]()


gulp.task('default', tasks)