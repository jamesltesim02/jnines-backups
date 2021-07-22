const gulp = require('gulp')
const taskList = require('./lib/task')

module.exports = function ({
    env='dev', 
    product, 
    template, 
    pattern, 
    ignore, 
    output, 
    cwd,
    compress
}) {
    let gulpTask = taskList({
        product,
        pattern, 
        product, 
        template, 
        ignore, 
        output, 
        cwd,
        compress
    })[env]
    
    if(!gulpTask) {
        return
    }
    gulp.task('default', gulpTask.task())
}