const gulp = require('gulp')
const fs = require('fs')
const mkdirsSync = require('mkdirs')
const SvnHelper = require('svn-helper')
const format = require('simple-date-format')

module.exports = function ({
    cwd,
    output
}) {
    let taskName = 'svninfo',
        inited = false

    function task() {
        if(!cwd) {
            return []
        }
        
        if(!inited) {
            inited = true
            
            gulp.task(taskName, async function () {
                let svnHelper = new SvnHelper({cwd})
                let sversion = await svnHelper.version()
                let time = new Date()
            
                mkdirsSync(output.codes + '/__js/common/')
            
                fs.writeFileSync(
                    output.codes+'/__js/common/version-info-h5.js',
                    `
                    window.VERSION_INFO_H5 = {
                        version: '${format(new Date(sversion.date), 'yyyyMMddHHmmss')}-${sversion.version}',
                        buildtime: '${format(time, 'yyyy-MM-dd HH:mm:ss')}'
                    }
                    `.replace(/\s{20}/gim, '\r\n')
                )
            })
        }

        return [taskName]
    }

    return {task}
}