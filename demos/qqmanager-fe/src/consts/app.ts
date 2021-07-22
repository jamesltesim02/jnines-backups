/** 语言枚举 */
export enum Locales {
  /** 中文key */
  ZH_CN = 'zh-CN',
  /** 英文key */
  EN_US = 'en-US'
};
/** 默认语言(zh-CN:简体中文) */
export const DEFAULT_LOCALE = Locales.ZH_CN;
/** 系统可选语言列表 */
export const LOCALE_LIST = [Locales.ZH_CN, Locales.EN_US];

/** 缓存key前缀 */
export const CACHE_KEY_PREFIX = 'qqmanage-fe';
/** 缓存key */
export enum CacheKeys {
  /** store app对应的缓存key */
  STORE_APP = 'store-app',
  /** store member对应的缓存key */
  STORE_MEMBER = 'store-member'
};
