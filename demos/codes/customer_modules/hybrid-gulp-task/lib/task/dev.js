const gulp = require('gulp')
module.exports = function ({
    pattern,
    compile,
    svninfo
}) {
    let taskName = 'dev',
        inited = false,
        tasks = [].concat(compile.task()).concat(svninfo.task())

    function task() {
        if(!inited) {
            gulp.task(taskName, function () {
                gulp.watch(pattern.wath || pattern.watch, tasks)
            })
        }

        return tasks.concat([taskName])
    }

    return {task}
}