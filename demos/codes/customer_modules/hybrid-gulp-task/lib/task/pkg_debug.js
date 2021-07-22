const gulp = require('gulp')
const del = require('delete')
const zip = require('gulp-zip')

module.exports = function ({
    product,
    pattern,
    output,
    compile,
    svninfo
}) {
    let taskName = 'pkg_debug',
        inited = false,
        tasks = [].concat(compile.task())
                  .concat(svninfo.task())

    function task() {
        if(!inited) {
            inited = true
            
            gulp.task(taskName, tasks, function () {
                let packName = output.zip || (product + '_debug.zip')    
                return gulp.src(output.codes + '/**/*')
                    .pipe(zip(packName))
                    .pipe(gulp.dest(output.path))
            })
        }

        del.sync([output.codes], {force: true})
        del.sync([output.path + '/' + output.zip], {force: true})

        return [taskName]
    }

    return {task}
}