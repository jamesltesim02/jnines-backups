simple-date-format  
===================  
js环境中做日期到字符串转换 

```sh
npm install simple-date-format --save
```

使用  
=====  
```javascript
import format from 'simple-date-format'
//或者 var format = require('simple-date-format')

// 使用默认的时间格式: yyyy-MM-dd HH:mm:ss
format(new Date())
// 自定义时间格式
format(new Date(), 'dd/MM HH:mm:ss.SSS')

```

pattern  
=======  
* `yyyy` - 4位数的年份, 如: 2019
* `yy` - 2位数的年份, 如: 19
* `M` - 月份, 如: 11 或 6
* `MM` - 2位数的月份, 不足2位会在前面补0, 如: 10 或 02
* `d` - 日期, 如: 23 或 8
* `dd` - 2位数日期,不足2位会在前面补0, 如 24 或 06 
* `H` - 小时, 如: 14 或 8
* `HH` - 2位数的小时, 不足2位会在前面补0, 如: 16 或 04
* `m` - 分钟, 如: 35 或 2
* `mm` - 2位数的分钟, 不足2位会在前面补0, 如: 52 或 09
* `s` - 秒, 如: 35 或 7
* `ss` - 2分组的秒, 不足2位会在前面补0, 如: 33 或 08
* `SSS` - 毫秒, 不会补0
