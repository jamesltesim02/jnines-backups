import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import AppConfig from '@/config/business.config.js';
import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';

// vue-i18n本地化支持插件
Vue.use(VueI18n);

const {
  langMapping,
  langValueMapping,
  lang: defaultLocale,
} = AppConfig;

/**
 * 获取默认语言
 */
const getDefaultLanguage = () => {
  let lang = loadFromStorage(StorageKey.LANGUAGE_KEY, defaultLocale);
  if (!lang) {
    const browserLanguage = window.navigator.language.toLowerCase();
    lang = langMapping[browserLanguage] || defaultLocale;
    saveToStorage(StorageKey.LANGUAGE_KEY, lang);
  }
  return lang;
};

/**
 * 加载语言包
 *
 * @param {string} lang
 *    当前语言
 */
const loadLocaleResource = async (lang) => {
  const { default: message } = await import(/* webpackChunkName: "lang-[request]" */ `@/assets/locales/${lang}.js`);
  return message;
};

/**
 * 为页面设置对应语言
 *
 * @param {string} lang
 *       语言值
 */
const setPageLanguage = (lang) => {
  axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
};

// vue-i18n的实例对象
let i18nInstance;
/**
 * 初始化vue需要绑定的i18n对象
 */
export const initI18n = async () => {
  const lang = getDefaultLanguage();

  i18nInstance = new VueI18n({
    locale: lang,
    fallbackLocale: lang,
    messages: {
      [lang]: await loadLocaleResource(lang),
    },
  });

  setPageLanguage(lang);

  return i18nInstance;
};

/**
 * 获取当前所使用的语言
 */
export const getLang = () => (i18nInstance ? i18nInstance.locale : '');
/**
 * 获取当前语言的具体值
 * 1: zh 中文简体
 * 2: zht 中文繁軆
 * 3: en English
 */
export const getLangValue = () => langValueMapping[getLang()];

/**
 * 重新设置语言
 *
 * @param {string} lang
 *      最新语言环境
 */
export const setLanguage = async (lang) => {
  if (!i18nInstance) {
    return;
  }

  if (!i18nInstance.messages[lang]) {
    i18nInstance.setLocaleMessage(lang, await loadLocaleResource(lang));
  }

  i18nInstance.locale = lang;
  setPageLanguage(lang);
  saveToStorage(StorageKey.LANGUAGE_KEY, lang);
};
