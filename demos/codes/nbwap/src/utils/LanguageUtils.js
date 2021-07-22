import {StorageKey} from '@/config/constants'

let lang = localStorage.getItem(StorageKey.LANGUAGE_KEY)
if (!lang) {
  lang = window.navigator.language.toLowerCase() || 'zh-cn'
  localStorage.setItem(StorageKey.LANGUAGE_KEY, lang)
}

/**
 * 获取当前的语言key
 */
export function getLanguage () {
  return lang
}

/**
 * 设置语言
 *
 * @param {string} newlang
 *    新语言环境key
 */
export function setLanguage (newlang) {
  lang = newlang
  localStorage.setItem(StorageKey.LANGUAGE_KEY, newlang)
}
