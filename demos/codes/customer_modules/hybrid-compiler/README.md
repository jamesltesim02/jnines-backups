### 介绍
用于编译hybrid代码的插件

### GIT 
http://10.66.72.20:8081/mobile-front-end/hybrid-compiler.git

### 引入及使用

#### 1. 安装  
    npm install hybrid-compiler --save-dev
#### 2. 引入  
    const compiler = require('hybrid-compiler')
    or  
    import compiler from 'hybrid-compiler
#### 3. 使用  
    gulp.src(pattern.htm)
    .pipe(compiler({
        target: 'D:/eclipse-php2/A01_website_bridge/_default',
        template: '_template/apptmpl.app.htm'
    }))
    .pipe(gulp.dest(output.codes+'/__html'))