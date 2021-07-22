const p = require('util').promisify
const exec = p(require('child_process').exec)
const parse = p(require('xml2js').parseString)
const iconv = require('iconv-lite')

/**
 * 针对svn操作的排序权重
 */
const opratePriority = {
    modifiedfile: 1,
    modifieddir: 2,
    addeddir: 3,
    addedfile: 4,
    deletedfile: 5,
    deletedir: 6
}

/**
 * SVN操作辅助类
 * 包含 version, diff, log等操作 
 */
class SvnHelper {

    constructor(config) {
        this.config = config
    }

    /**
     * 执行svn 命令,以json方式返回执行结果
     * 
     * @param command 
     *          执行命令
     * @param options 
     *          执行的参数，可以为空
     * 
     * @return 以json方式返回执行结果
     * 
     */
    async cmd(command, options = null) {

        if(!command) {
            throw new Error('svn执行命令不能为空')
        }

        let authinfo = []
        let config = this.config
        let encoding = 'cp936'
        let binaryEncoding = 'binary'

        if(config.username && config.password) {
            authinfo.unshift(
                '--username ' + config.username,
                '--password ' + config.password,
                '--no-auth-cache'
            );
        }

        let cmdStr = `svn ${command} ${(options || []).concat(authinfo).join(' ')}` //${config.cwd}
        let {stdout, stderr} = await exec(
            cmdStr, 
            {
                cwd: config.cwd,
                encoding: 'binary',
                maxBuffer:  10485760 //1024 * 1024 * 10
            }
        )
        if (stderr && stderr.length) {
            console.log(cmdStr, config.cwd)
            throw new Error(iconv.decode(new Buffer(stderr, 'binary'), 'cp936'))
        }

        let decodedResult = iconv.decode(new Buffer(stdout, 'binary'), 'cp936');

        if(decodedResult) {
            try {
                decodedResult = await parse(decodedResult)
            } catch(e) {
                // 转换出错，无需提示，按原样返回
                //console.log(e, decodedResult)
            }
        }
        

        return decodedResult
    }

    /**
     * 获取最大版本号
     * 
     * @param target 
     *          获取目标 local: 本地目录, remote: 远程仓库，可以为空，默认为remote
     * 
     * @return 版本信息 
     *         {
     *              version,
     *              author,
     *              date
     *         }
     */
    async version(target = 'remote') {
        let {
            info: {
                entry: [
                    {
                        commit: [
                            {
                                $: {
                                    revision
                                },
                                author: [author1],
                                date: [date1]
                            }
                        ]
                    }
                ]
            }
        } = await this.cmd('info', [(target === 'remote' ? '-r HEAD' : ''), '--xml'])

        return {
            version: +revision,
            author: author1,
            date: Date.parse(date1)
        }
    }

    /**
     * 获取指定版本之间的文件差异
     * 
     * @param v1 
     *          起始版本号
     * @param v2 
     *          结束版本号
     * 
     * @return 文件差异列表
     *          [
     *              {
     *                  _: 'xx/xxx', // 文件路径
     *              }
     *          ]
     */
    async diff(v1, v2) {
        let {
            diff: {
                paths: [{path}]
            }
        } = await this.cmd('diff', [`-r ${v1}:${v2}`, '--summarize', '--xml'])

        if (!path) {
            return
        }

        return path.sort(function (p1, p2) {
            let priority = opratePriority[p1.$.item+p1.$.kind] - opratePriority[p2.$.item+p2.$.kind]

            if(priority == 0) {
                return p1._.localeCompare(p2._)
            }
            return priority
        })
    }

    /**
     * 获取svn指定版本的提交日志,降序排列
     * 
     * @param v1
     *          起始版本号
     * @param v2 
     *          结束版本号，可以为空，默认为最新版本号
     */
    async log(v1, v2) {
        let {
            log: {
                logentry
            }
        } = await this.cmd('log', [`-r ${v2 || this.getVersion()}:${v1}`, '-v', '--xml'])
        return logentry
    }

    /**
     * 更新本地svn目录到最新版本
     */
    async update() {
        await this.cmd('update')
    }

    /**
     * 提交本地文件到服务器
     * 
     * @param message 
     *          提交备注
     */
    async commit(message) {
        let {
            status: {
                target: [{entry}]
            }
        } = await this.cmd('status', ['--xml'])

        if(!entry || !entry.length) {
            return null;
        }

        await this.cmd('add', ['*', '--force'])
        
        let result = await this.cmd('commit', [`-m "${message}"`])

        return +result.split(/提交后的版本为|Committed revision/).pop().replace(/\D/gi, '')
    }
}

module.exports = SvnHelper