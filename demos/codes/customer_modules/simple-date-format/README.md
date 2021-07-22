### 介绍
用于转换日期到字符串

### GIT
http://10.66.72.20:8081/mobile-front-end/date-format.git

### 引入及使用
#### 1.安装
    npm install --save-dev simple-date-format
#### 2.引入
    import format from 'simple-date-format'
    or
    const format = require('simple-date-format')
#### 3. 使用
    // 只支持到 年 月 日 时 分 秒字段的转换
    let dateStr = format(new Date(), 'yyyy-MM-dd HH:mm:ss')