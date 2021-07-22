import sdf from 'simple-date-format'

import { TIME_ZONE_OFFSET } from '../config/config.ops'
import { isServer, isProd } from '../utils/env-utils'

/**
 * 时区差基数, 1分钟 (60000毫秒)
 */
const OFFSET_STEP = 60000

/**
 * 转换时间为指定时区时间, 只针对服务器环境, 浏览器环境以当时浏览器时区为主  
 *
 * @param {date} source 被转换的时间  
 * @param {number} localeOffset 时区偏差值  
 */
export const getLocaleDate = (source = Date.now(), localeOffset = TIME_ZONE_OFFSET) => {
  if (!source) {
    return source
  }

  if (!isServer() || !isProd()) {
    return new Date(source)
  }

  if (typeof source !== 'number') {
    if (source.constructor === Date) {
      source = source.getTime()
    } else {
      source = Number(source)
      if (isNaN(source)) {
        return source
      }
    }
  }

  return new Date(source + (localeOffset * OFFSET_STEP))
}

/**
 * 改造后的时间格式化函数,服务器端时会自动添加时区值  
 *
 * @param {date} source 被转换的时间  
 * @param {string} pattern 时间格式  
 * @param {number} localeOffset 时区偏差值  
 */
export const dateFormat = (source, pattern, localeOffset) => sdf(getLocaleDate(source, localeOffset), pattern)

export default getLocaleDate