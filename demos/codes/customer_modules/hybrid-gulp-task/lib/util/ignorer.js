const through  = require('through2')

module.exports = function (pattern) {
    return through.obj(function (file, enc, cb) {
        if(!pattern || !pattern.test(file.path)) {
            return cb(null, file)
        }
        return cb(null,null)
    })
}