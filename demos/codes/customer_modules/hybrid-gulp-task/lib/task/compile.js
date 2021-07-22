const gulp = require('gulp')
const through = require('through2')
const imagemin = require('gulp-imagemin')
const cleancss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const mkdirsSync = require('mkdirs')
const autoprefixer = require('gulp-autoprefixer')
const compiler = require('hybrid-compiler')
const ignorer = require('../util/ignorer')
const postcss = require('gulp-postcss')
const cssnext = require('cssnext')
const precss = require('precss')
const postcss_nested = require('postcss-nested')
const postcss_mixin = require('postcss-mixins')

/**
 * 编译代码
 */
module.exports = function ({
    template, 
    pattern, 
    ignore, 
    output
}) {
    async function doCompile({path=output.codes}) {
        mkdirsSync(path);
        return Promise.all([
            // copy config
            new Promise(function (resolve, reject){
                gulp.src(pattern.config)
                .pipe(gulp.dest(path+'/__config'))
                .on('end', resolve)
            }),
            // 编译htm
            new Promise(function (resolve, reject){
                gulp.src(pattern.htm)
                .pipe(ignorer(ignore.htm))
                .pipe(compiler({
                    target: path,
                    compress: output.compress,
                    template
                }))
                .pipe(gulp.dest(path+'/__html'))
                .on('end', resolve)
            }),
            // copy css
            new Promise(function (resolve, reject){
                gulp.src(pattern.css)
                .pipe(ignorer(ignore.css))
                .pipe(postcss([cssnext, precss, postcss_mixin]))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: true,
                }))
                .pipe(cleancss())
                .pipe(gulp.dest(path+'/__css'))
                .on('end', resolve)
            }),
            // copy js
            new Promise(function (resolve, reject){
                gulp.src(pattern.js)
                .pipe(ignorer(ignore.js))
                .pipe(through.obj(function (file, enc, cb) {
                    var buildContent = file._contents.toString(enc)
                    file.contents = new Buffer(buildContent, enc)
                    return cb(null, file)
                }))
                // .pipe(jshint('.jshintrc'))
                .pipe(uglify())
                .pipe(gulp.dest(path + '/__js'))
                .on('end', resolve)
            }),
            // copy img
            new Promise(function (resolve, reject){
                gulp.src(pattern.img)
                .pipe(ignorer(ignore.img))
                // .pipe(imagemin([
                //     imagemin.gifsicle({interlaced: true}),
                //     imagemin.jpegtran({progressive: true}),
                //     imagemin.optipng({optimizationLevel: 5}),
                //     imagemin.svgo({plugins: [{removeViewBox: true},{cleanupIDs: false}]})
                // ]))
                .pipe(gulp.dest(path + '/__static'))
                .on('end', resolve)
            })
        ])
    }

    let taskName='compile',
        inited = false
    function task() {
        if(!inited) {
            inited = true
            gulp.task(taskName, doCompile)
        }
        return [taskName]
    }

    return {
        doCompile,
        task
    }
}

