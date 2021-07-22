const gulpTask = require('hybrid-gulp-task')
const {
    env,
    product,
    template,
    input,
    output,
    cwd
} = require('./appconfig')

const ignore = input.ignore ? input.ignore : {}

gulpTask({
    env,
    product,
    template: template[env === 'dev' ? 'website' : 'app'],
    pattern: input.pattern,
    ignore:  Object.assign({}, ignore.default, ignore[env]),
    output: output[env],
    cwd
})