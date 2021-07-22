### 介绍
用于编译hybrid代码的插件

### GIT 
http://10.66.72.20:8081/mobile-front-end/hybrid-gulp-task.git

### 引入及使用

#### 1. 安装  
    npm install hybrid-gulp-task --save-dev
#### 2. 引入  
    const gulpTask = require('hybrid-gulp-task')
    or  
    import gulpTask from 'hybrid-gulp-task
#### 3. 使用  
    // 引入配置
    const {
        env,
        product,
        template,
        input,
        output,
        cwd
    } = require('./appconfig')
    // 执行任务
    gulpTask({
        env,
        product,
        template: template[env === 'dev' ? 'website' : 'app'],
        pattern: input.pattern,
        ignore:  Object.assign(input.ignore.default || {}, input.ignore[env]),
        output: output[env],
        cwd
    })