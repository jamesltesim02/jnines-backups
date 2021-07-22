/** 语言枚举 */
export enum Locales {
  /** 中文key */
  ZH_CN = 'zh',
  /** 英文key */
  EN_US = 'en'
}
/**皮肤类型*/
export enum SkinType {
  BLACK = 'dark',
  WHITE = 'light'
}
/**
 * 接受的赔率
 *
 * * 0 - NO - 不接受
 * * 1 - BETTER - 接受更好赔率
 * * 2 - ALL - 接受所有赔率
 */
export enum OddsAccept {
  /** 不接受 */
  NO = 0,
  /** 接受更好赔率 */
  BETTER = 1,
  /** 接受所有赔率 */
  ALL = 2
}

/** 默认金额 */
export const DEFAULT_AMOUNT = 0;

/**
 * 进球提示配置类型
 *
 * 0 - NONE - 不提示
 * 1 - UNMUTED - 提示所有(提示音+notification)
 * 2 - MUTED - 静音模式, 只显示底部notification提示
 */
export enum GoalSoundType {
  /** 不提示 */
  NONE = 0,
  /** 提示所有(提示音+notification) */
  UNMUTED = 1,
  /** 静音模式, 只显示底部notification提示 */
  MUTED = 2
};

/** 默认语言(zh-CN:简体中文) */
export const DEFAULT_LOCALE: Locales = window.navigator.language.split('-')[0] as Locales || Locales.ZH_CN;
/** 系统可选语言列表 */
export const LOCALE_LIST = [Locales.ZH_CN, Locales.EN_US];

/**默认设置 */
export const DEFAULT_SETTINGS = {
  /** 皮肤*/
  _skin_type : SkinType.BLACK,
  /** 赔率*/
  _odds_accept : OddsAccept.ALL,
  /** 金额 */
  _accept_amount : DEFAULT_AMOUNT,
  /** 进球提示音 */
  _goal_sound: GoalSoundType.UNMUTED
}

/** 缓存key前缀 */
export const CACHE_KEY_PREFIX = 'j9sport';
/** 缓存key */
export enum CacheKeys {
  /** store app对应的缓存key */
  STORE_APP = 'store-app',
  /** store member对应的缓存key */
  STORE_MEMBER = 'store-member'
}
/** 最大投注额 */
export const MAX_COMBO_BET = 10

/** 注单推送回来状态 */
export enum TICKET_STATUS {
  FAILED = 0,
  SUCCESS = 1
}
/** 注单移除时间 ms */
export const TICKET_REMOVE_TIME = 8000

/** 快捷投注额度  */
export const QK_QUOTA = [50, 100, 200, 500]

/** 货币代号 */
export const CURRENCY_MAP = {
  1: 'CNY',
  2: 'USD',
  101: 'CNY'
} as any;


// * 1: MoH5-手机端H5  
// * 2: PcH5-PC端H5  
// * 3: AndroidApp-android客户端  
// * 4: AndroidH5-android H5  
// * 5: IosApp-ios 客户端   
// * 6: IosH5-ios H5  
// * 7: QMoH5-快捷投注手机H5  
// * 8: QPcH5-快捷投注PCH5  
// * 9: Cocos-游戏终端  
export enum ClientTypes {

  
}

