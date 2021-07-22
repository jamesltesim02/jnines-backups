var DEFAULT_PATTERN = 'yyyy-MM-dd HH:mm:ss'
var DAY_OF_WEEK = {
  zh: ['周日','周一','周二','周三','周四','周五','周六'],
  en: ['Su','Mo','Tu','We','Th','Fr','Sa']
}

function format(source, pattern, locale = 'zh') {
  if (!source) {
    return ''
  }

  if (!pattern) {
    pattern = DEFAULT_PATTERN
  }

  if (typeof pattern !== 'string') {
    console.log('Parameter [pattern] is invalid, must be a string.')
    pattern = DEFAULT_PATTERN
  }

  if (['number', 'string'].indexOf(typeof source) !== -1) {
    source = new Date(source)
  }

  if (source.constructor !== Date) {
    console.warn('Parameter [source] is invalid, must be number or string or Date.')
    return ''
  }

  var dateFields = {
    // 2位数的年份
    yy: source.getFullYear() % 100,
    // 4位数的年份
    yyyy: source.getFullYear(),
    // 月份
    M: source.getMonth() + 1,
    // 不足2位前面补0的月份
    MM: source.getMonth() + 1,
    // 日期
    d: source.getDate(),
    // 不足2位前面补0的日期
    dd: source.getDate(),
    // 12小时制的小时
    h: source.getHours() % 12,
    // 不足2位前面补0的12小时制的小时
    hh: source.getHours() % 12,
    // 24小时制的小时
    H: source.getHours(),
    // 不足2位前面补0的24小时制小时
    HH: source.getHours(),
    // 分钟
    m: source.getMinutes(),
    // 不足2位前面补0的分钟
    mm: source.getMinutes(),
    // 秒
    s: source.getSeconds(),
    // 不足2位前面补0的秒
    ss: source.getSeconds(),
    // 毫秒
    S: source.getMilliseconds(),
    // 不足
    SSS: source.getMilliseconds(),
    // 星期对应的值 (1234567)
    W: source.getDay() + 1,
    // 中文星期 (只会显示 日一二三四五六 中的一位)
    WZ: DAY_OF_WEEK[locale][source.getDay()]
  }

  return pattern.replace(/yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|WZ|W/g, function (fm) {
    var value = dateFields[fm]

    if (fm.length === 1 || fm === 'WZ') {
      return value
    }

    return ('0000' + value).substr(-fm.length)
  })
}

module.exports = format
module.exports.format = format
module.exports.DEFAULT_PATTERN = DEFAULT_PATTERN
