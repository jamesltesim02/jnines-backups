### 介绍
用于在node环境中操作svn工具,提供 `version`、`diff`、`log`、`update`、`commit`等操作

### GIT
http://10.66.72.20:8081/mobile-front-end/svn-helper.git

### 依赖
必须依赖于svn命令行工具,下载地址: 
http://10.66.72.20:8083/static/download/Setup-Subversion-1.8.17.msi

### 安装及使用
#### 1.安装
    npm install --save-dev svn-helper
#### 2.引入
    const SvnHelper = require('svn-helper')
    or
    import SvnHelper from 'svn-helper'
#### 3.使用
    // cwd为本地关联了svn的文件夹目录
    let codeSVN = new SvnHelper({cwd: appconfig.svn.cwd + '/_src'})
    // 获取最新版本
    codeInfo = await codeSVN.version()
