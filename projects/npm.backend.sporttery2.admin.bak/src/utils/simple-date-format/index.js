'use strict'
var DEFAULT_PATTERN = 'yyyy-MM-dd HH:mm:ss'

function format(source, pattern) {
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
    yy: source.getFullYear() % 100,
    yyyy: source.getFullYear(),
    M: source.getMonth() + 1,
    MM: source.getMonth() + 1,
    d: source.getDate(),
    dd: source.getDate(),
    h: source.getHours() % 12,
    hh: source.getHours() % 12,
    H: source.getHours(),
    HH: source.getHours(),
    m: source.getMinutes(),
    mm: source.getMinutes(),
    s: source.getSeconds(),
    ss: source.getSeconds(),
    SSS: source.getMilliseconds()
  }

  return pattern.replace(/yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|SSS/g, (fm) => {
    var value = dateFields[fm]
    if (fm.length === 1) {
      return value
    }
    return fm === 'SSS' ? value : ('0000' + value).substr(-fm.length)
  })
}

module.exports = format
module.exports.format = format
module.exports.DEFAULT_PATTERN = DEFAULT_PATTERN
