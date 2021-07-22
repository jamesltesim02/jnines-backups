/**
 * 本地缓存的key名
 */
export const StorageKey = {
  // 语言类型
  LANGUAGE_KEY: 'nbjc-user-language',
  // 皮肤类型 key
  THEME_KEY: 'nbjc-theme',
  // 商户用户信息
  CASINO_USER_KEY: 'nbjc-casino-userinfo',
  // 商户id key
  FRONT_ID_KEY: 'nbjc-front-id',
  // 商户域名key
  PORTAL_DOMAIN_KEY: 'nbjc-portal-domain',
  // 商户账号
  PORTAL_LOGIN_NAME: 'nbjc-portal-login-name',
  // 商户网站token
  PORTAL_MEMBER_TOKEN: 'nbjc-portal-member-token',
  // 购物车key
  BET_CART_KEY: 'nbjc-bet-cart',
  // 受理中投注单key
  BET_OID_KEY: 'nbjc-bet-oid',
  // 购物车MactchID key
  BET_MID_KEY: 'nbjc-bet-mid',
  // 投注模式KEY
  BETTING_MODE_KEY: 'nbjc-betting-model',
  // 投注样式KEY
  BETTING_STYLE_KEY: 'nbjc-betting-style',
};

/**
 * 业务接口中的常量code
 */
export const BusinessCodes = {
  // 403 code, 地域限制
  SERVICE_ERROR_403: '1001001',
  // 503 code, 系统维护
  SERVICE_ERROR_503: '1001002',
};

/**
 * 开放的体育类型列表
 *
 *   10 = Soccer 足球
 *   11 = Basketball 篮球
 *   12 = Tennis 网球
 *   13 = 台球
 *   14 = LOL 英雄联盟
 *   15 = Dota2 刀塔2
 *   16 = ArenaOfValor 王者荣耀
 *   17 = CounterStrike 反恐精英
 *   18 = StarCraft 星际争霸
 *   19 = Overwatch 守望先锋
 *   20 = 乒乓
 *   21 = 保龄球
 *   22 = 拳击
 *   23 = 排球
 *   24 = 橄榄球
 *   25 = 羽毛球
 *   26 = 高尔夫
 */
export const SportsList = [
  // 10 = Soccer 足球
  {
    sno: 10,
    visible: true,
    available: true,
  },
  // 11 = Basketball 篮球
  {
    sno: 11,
    visible: true,
    available: true,
  },
  // 12 = Tennis 网球 (暂不支持) *
  {
    sno: 12,
    visible: true,
    available: true,
  },
  // 13 = 台球 (暂不支持)
  {
    sno: 13,
    visible: true,
    available: true,
  },
  // 14 = LOL 英雄联盟 *
  {
    sno: 14,
    visible: true,
    available: true,
  },
  // 15 = Dota2 刀塔2 (暂不支持)
  {
    sno: 15,
    visible: true,
    available: true,
  },
  // 16 = ArenaOfValor 王者荣耀 (暂不支持)
  {
    sno: 16,
    visible: true,
    available: true,
  },
  // 17 = CounterStrike 反恐精英
  {
    sno: 17,
    visible: true,
    available: true,
  },
  // 18 = StarCraft 星际争霸 (暂不支持) *
  {
    sno: 18,
    visible: true,
    available: true,
  },
  // 19 = Overwatch 守望先锋 (暂不支持)
  {
    sno: 19,
    visible: true,
    available: true,
  },
  // 20 = 乒乓
  {
    sno: 20,
    visible: true,
    available: true,
  },
  // 21 = 保龄球
  {
    sno: 21,
    visible: true,
    available: true,
  },
  // 22 = 拳击
  {
    sno: 22,
    visible: true,
    available: true,
  },
  // 23 = 排球
  {
    sno: 23,
    visible: true,
    available: true,
  },
  // 24 = 橄榄球
  {
    sno: 24,
    visible: true,
    available: true,
  },
  // 25 = 羽毛球
  {
    sno: 25,
    visible: true,
    available: true,
  },
  // 26 = 高尔夫
  {
    sno: 26,
    visible: true,
    available: true,
  },
];

/**
 * 列表各球类显示玩法信息
 */
export const MATCH_LIST_GAMES = {
  // 足球 1: 胜平负, 2: 让分胜平负
  10: [1, 14],
  // 篮球 18: 大小, 186: 胜负
  11: [18, 186],
  // 英雄联盟 16: 让分, 186 胜负
  14: [16, 186],
  // 反恐精英 16: 让分, 186 胜负
  17: [16, 186],
};
