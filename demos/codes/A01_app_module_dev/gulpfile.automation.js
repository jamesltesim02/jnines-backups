/**
 * 命令： gulp --gulpfile gulpfile.automation.js --distcode D:/eclipse-php2/A01_website_bridge/_default --distzip D:/eclipse-php2/A01_mobile/download --cversion 2345
 * 
 *      --gulpfile gulp构建代码文件路径
 *      --distcode 编译代码输出目录
 *      --distzip  打包输出目录
 *      --zipname  打包输出的文件名
 *      --cversoin 编译时的代码版本号
 * 
 */

const gulp = require('gulp')
const fs = require('fs')
const mkdirsSync = require('mkdirs')
const format = require('simple-date-format')
const del = require('delete')
const zip = require('gulp-zip')
const minimist = require('minimist')

const {
    distcode,
    distzip,
    cversion,
    agent,
    cdate,
    zipname = 'app.zip'
} = minimist(process.argv.slice(2))

if(!distcode) {
    throw new Error('distcode must be not empty, please use --distcode input it')
}
if(!distzip) {
    throw new Error('distzip must be not empty, please use --distzip input it')
}
if(!cversion) {
    throw new Error('cversion must be not empty, please use --cversion input it')
}

const {
    env,
    product,
    template,
    input,
    cwd
} = require('./appconfig')

const compile = require('hybrid-gulp-task/lib/task/compile')({
    template: template.app, 
    pattern: input.pattern, 
    ignore: Object.assign({},input.ignore?input.ignore.default:null), 
    output: {
        codes: distcode,
        path: distzip
    }
})

gulp.task('versioninfo', function () {
    mkdirsSync(distcode + '/__js/common/')
    fs.writeFileSync(
        distcode+'/__js/common/version-info-h5.js',
        `
        window.VERSION_INFO_H5 = {
            version: '${(cdate ? cdate+'-' : '') + cversion}',
            buildtime: '${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}',
            agent: {${agent ? `id: '${agent}'` : ''}}
        }
        `.replace(/\s{8}/gim, '\r\n')
    )
})

gulp.task('pkg_automation', [...compile.task(), 'versioninfo'], function () {
    return gulp.src(distcode + '/**/*')
        .pipe(zip(zipname))
        .pipe(gulp.dest(distzip)).on('end',()=>{
            console.log(distzip + '/' + zipname)
        })
})

del.sync([distcode], {force: true})
del.sync([distzip + '/' + zipname], {force: true})
gulp.task('default', ['pkg_automation'])