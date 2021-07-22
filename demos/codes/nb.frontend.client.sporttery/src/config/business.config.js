/**
 * app相关配置
 */
export default {
  /*
   * 1: zh 中文简体
   * 2: zht 中文繁軆
   * 3: en English
   */
  langValueMapping: {
    zh: 1,
    zht: 2,
    en: 3,
  },
  langMapping: {
    'zh-cn': 'zh',
    'zh-tw': 'zht',
    'zh-hk': 'zht',
    'en-us': 'en',
  },
  // 默认语言
  lang: 'zh',
  // 每页记录条数
  itemSizeOfPage: 20,
  // 配置默认值
  setting: {
    // 赔率类型 1: 标准盘 3: 香港盘
    oddsType: 1,
    // 接收赔率变化类型 0 = 不接收赔率变化， 1 = 接收更高赔率， 2 = 接收所有赔率变化
    oddsAC: 2,
    // 当前使用货币, 1: RMB，详见常量定义
    currency: 1,
    // 客户端类型 1 PC, 2 IOS, 3 Andriod, 4 其他
    clientType: 2,
    // 默认投注额
    betAmount: 100,
  },
  // 针对现金网的终端类型 1:H5 2:PC 3:Android 4:IOS 5其他
  terminal: 1,
  // 接口调用超时时间
  apiTimeout: 150000,
  // 推送心跳间隔时间
  pushAliveTime: 30000,
  // 推送重连时间
  pushReconnectTime: 35000,
  // 推送连接重试次数
  pushRetryTimes: 5,
  // 提前结算刷新时间
  earlyCashTime: 20000,
  // 赛程列表刷新频率(默认: 5分钟, 0为不刷新)
  matchsReloadTime: 300000,
  // 平台用户信息缓存时间(默认: 10秒钟, 0为不缓存)
  memberInfoCacheTime: 10000,
  // 商户配置信息缓存时间(10分钟, 0为不缓存)
  // portalCacheTime: 600000,
  portalCacheTime: 0,
  // 广告在列表中的位置
  matchAdPosition: 5,
  // AG商户账号信息缓存时间(1分钟, 0为不缓存)
  agUserCacheTime: 0,
  // AG存款通道缓存时间(10分钟, 0为不缓存)
  agPaymentInfoCacheTime: 0,
  // AG session 保持间隔时间(25分钟: 1000 * 60 * 25)
  keepPortalSessionTime: 1500000,
  // token 保持间隔时间(25分钟: 1000 * 60 * 18)
  keepPortalTokenTime: 1500000,
  // 包含iframe的页面,通过
  iframePages: [
    // 比赛详情
    /^\/detail/,
    // 在线客服
    /^\/customer-service/,
  ],
};
