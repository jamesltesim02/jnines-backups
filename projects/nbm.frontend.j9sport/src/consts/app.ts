/** 缓存版本,缓存版本变化时会清空浏览器所有缓存内容 */
export const CACHE_VERSION: number = 2021.03;

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
// export const DEFAULT_LOCALE: Locales = window.navigator.language.split('-')[0] as Locales || Locales.ZH_CN;
// export const DEFAULT_LOCALE: Locales = window.navigator.language.split('-')[0] as Locales || Locales.ZH_CN;
export const DEFAULT_LOCALE: Locales = Locales.ZH_CN;
/** 系统可选语言列表 */
export const LOCALE_LIST = [Locales.ZH_CN, Locales.EN_US];

/**默认设置 */
export const DEFAULT_SETTINGS = {
  /** 皮肤*/
  _skin_type : SkinType.BLACK,
  /** 赔率*/
  _odds_accept : OddsAccept.BETTER,
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
  STORE_MEMBER = 'store-member',
  /* 缓存版本号 */
  CACHE_VERSION = 'cache-version',
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

export const CURRENCY_MAP: any = {
  /** 人民币 */
  1: '¥',
  13: '¥',
  /** USDT */
  2: '₮',
  /** 越南盾 */
  3: '₫',
  /** 泰铢 */
  4: '฿',
  /** 美金 */
  5: '$',
  /** 虚拟货币 */
  101: 'VIR',
};

export const CURRENCY_MAP_TEXT: any = {
  /** 人民币 */
  1: 'CNY',
  13: 'CNY',
  /** USDT */
  2: 'USDT',
  96: 'USDT',
  /** 越南盾 */
  3: 'VND',
  /** 泰铢 */
  4: 'THB',
  /** 美金 */
  5: 'USD',
  /** 虚拟货币 */
  101: 'VIR',
};

/** 第三方appid */
export enum APP_ID {
  J9 = 100,
  SHABA = 101,
  YSB = 102,
  ODDIN = 103,
  XUNI = 104
}

/**  会员中心查询额度事件 */
export const MEMBER_RELOAD_EVENT = 'member-reload-balance';

/**
 * 终端类型
 *
 * * 1: 手机端H5
 * * 2: PC端H5
 * * 3: android客户端
 * * 4: androidH5
 * * 5: ios客户端
 * * 6: iosH5
 * * 7: 快捷投注手机H5
 * * 8: 快捷投注PCH5
 * * 9: 游戏终端
 */
export enum ClientTypes {
  /** 1: 手机端H5 */
  H5_MOBILE = 1,
  /** 2: PC端H5 */
  H5_PC = 2,
  /** 3: android客户端 */
  APP_ANDROID = 3,
  /** 4: androidH5 */
  HYBRID_ANDROID = 4,
  /** 5: ios客户端 */
  APP_IOS = 5,
  /** 6: iosH5 */
  HYBRID_IOS = 6,
  /** 7: 快捷投注手机H5 */
  QUICKBET_MOBILE = 7,
  /** 8: 快捷投注PCH5 */
  QUICKBET_PC = 8,
  /** 9: 游戏终端 */
  OTHER_COCOS = 9,
}

/** 主站对应页面的地址 */
export const MainSitePath = {
  /** 国际厅 */
  AGIN: '/game/show/agin/',
  /** 旗舰厅 */
  AGQJ:　'/game/show/agq/',
  /** 捕鱼王 */
  FISHING: '/game/show/fishing/',
  /** 电子游戏 */
  SLOT: '/game/dygame/',
  /** 取款 */
  WITHDRAWAL: 'ucenter/withdraw/withdrawIndex/'
}

export const THEME_EVENT_ID = {
  /** 欧洲杯 */
  EUROPE: '226218935656448'
}
