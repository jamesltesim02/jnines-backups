import NBConstant from '@/assets/js/base'
import {loadScript} from './ResourceUtils'
import {
  loadFromStorage,
  saveToStorage
} from '@/utils/StorageUtils'

const env = window
const localeKeyMap = {
  'zh-cn': 'lan_zh',
  'en-us': 'lan_en'
}

/**
 * 加载语言文件
 * @param {string} lang
 *      语言文件key
 */
// export function getLanguage (lang) {
//   let locales = loadFromStorage('nb_locales', {})
//   let language = locales[lang]

//   if(!language) {
//     loadScript(`${env.NBServer.p_stm}language-${lang}.js`, {async: false})
//     language = env[localeKeyMap[lang]]
//     if(!language) {
//       throw new Error('加载本地语言资源出错')
//     }

//     locales[lang] = language
//     saveToStorage(NBConstant.NB_MOBILE_LOCALES, locales)
//   }

//   return language
// }

export const getLanguage = async (lang) => {
  if (!lang) {
    let config = loadFromStorage(NBConstant.platform_settings, {
      'nb_language': NBConstant.plate_config.nb_language
    })

    lang = config.nb_language
  }

  let locales = loadFromStorage(NBConstant.NB_MOBILE_LOCALES, {})
  let locale = locales[lang]

  if (locale) {
    return {language: lang, locale}
  }

  await loadScript(`${env.NBServer.p_b}language-${lang}.js`, {async: false})
  locale = env[localeKeyMap[lang]]
  if(!locale) {
    throw new Error('加载本地语言资源出错')
  }

  locales[lang] = locale
  saveToStorage(NBConstant.NB_MOBILE_LOCALES, locales)

  return {language: lang, locale}
}