const isProd = process.env.NODE_ENV === 'production'
const getOrigin = (prefix, defaultUrl) => {
  const PROMOTE_REGEXP = /^sptm?/i;
  const {
    protocol,
    host
  } = window.location;

  if (!PROMOTE_REGEXP.test(host)) {
    return defaultUrl;
  }

  return `${protocol}//${host.replace(PROMOTE_REGEXP, prefix)}/`;
}

/** 运维配置文件, 非开发环境会屏蔽此文件, 修改后需要重新build */
// eslint-disable-next-line
const UAT_CONFIG = {
  /** 商户ID */
  FRONT_ID: '10077100werw564wesfx',
  /** 
   * ### 终端类型  
   *
   * 1: MoH5-手机端H5  
   * 2: PcH5-PC端H5  
   * 3: AndroidApp-android客户端  
   * 4: AndroidH5-android H5  
   * 5: IosApp-ios 客户端   
   * 6: IosH5-ios H5  
   * 7: QMoH5-快捷投注手机H5  
   * 8: QPcH5-快捷投注PCH5  
   * 9: Cocos-游戏终端  
   */
  CLIENT_TYPE: 1,
  /** cdn地址 */
  // CDN_URL: isProd ? 'https://agm.nbmm.co/' : 'http://localhost:8600/',
  CDN_URL: '',
  /** 数据对应资源地址(上传的图片地址) */
  /** RESOURCE_URL: 'https://ag-imgs.hcdda.cn/cdn/',*/
  RESOURCE_URL: 'https://j9-imgs.nbmm.co/cdn/',
  /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
  MEDIA_URL: 'https://ag-live.nbmm.co/',
  // MEDIA_URL: 'https://live.nbmm.co/',
  // MEDIA_URL: 'http://localhost:29103/',
  /** pull接口地址 */
  PULL_URL: 'https://ag-pull.nbmm.co/',
  /** 新版pull地址(用于查询红包相关信息) */
  V2_PULL_URL: 'https://j9-pull.nbmm.co/',
  /** 投注接口地址 */
  BET_URL: 'https://j9-bet.nbmm.co/',
  /** 点水接口地址 */
  QUOTE_URL: 'https://j9-quote.nbmm.co/',
  /** 推送地址 */
  PUSH_URL: 'wss://j9-push.nbmm.co/websocket/',
  //===================================================================
  /** 登录地址, 只用于前期测试 */
  SIGN_URL: 'https://j9-seamless.nbmm.co/',
  /** 默认的origin地址, 用于跳转到登陆或存取款地址 */
  DEFAULT_ORIGIN: getOrigin('m', 'https://h5.uatnine.com/'),
  /** 新版手机站地址 */
  V2_SITE_URL: 'https://m.nbmm.co/',
  /** 红彩前端地址 */
  // HC_URL: 'https://devm.nbmm.co/',

  //===================================================================
  /** 缓存版本号, 页面加载时会检测版本号,如果有变化,则会清空所有缓存 */
  STORAGE_VERSION: 2020.002,
  /** 谷歌统计id */
  GA_ID: 'UA-173126539-1',
}

// eslint-disable-next-line
const PROD_CONDIG = {
  /** 商户ID */
  FRONT_ID: '10077100werw564wesfx',
  /** 
   * ### 终端类型  
   *
   * 1: MoH5-手机端H5  
   * 2: PcH5-PC端H5  
   * 3: AndroidApp-android客户端  
   * 4: AndroidH5-android H5  
   * 5: IosApp-ios 客户端   
   * 6: IosH5-ios H5  
   * 7: QMoH5-快捷投注手机H5  
   * 8: QPcH5-快捷投注PCH5  
   * 9: Cocos-游戏终端  
   */
  CLIENT_TYPE: 1,
  /** cdn地址 */
  CDN_URL: 'http://localhost:8600/',
  /** 数据对应资源地址(上传的图片地址) */
  RESOURCE_URL: 'https://imgs.j9sport.com/cdn/',
  /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
  MEDIA_URL: 'https://live.hcdda.cn/',
  // MEDIA_URL: 'https://ag-live.nbmm.co/',
  // MEDIA_URL: 'https://live.nbmm.co/',
  /** pull接口地址 */
  PULL_URL: 'https://pull.j9vipp8.com/',
  /** 投注接口地址 */
  BET_URL: 'https://bet.j9vipp8.com/',
  /** 点水接口地址 */
  QUOTE_URL: 'https://quote.j9vipp8.com/',
  /** 推送地址 */
  PUSH_URL: 'wss://push.j9vipp8.com/websocket/',
  //===================================================================
  /** 登录地址, 只用于前期测试 */
  SIGN_URL: 'https://ag-seamless.nbmm.co/',
  /** 默认的origin地址, 用于跳转到登陆或存取款地址 */
  DEFAULT_ORIGIN: isProd ? 'https://j92021.com/' : `https://j92021.com/`,

  /** 红彩前端地址 */
  // HC_URL: 'https://devm.nbmm.co/',

  //===================================================================
  /** 缓存版本号, 页面加载时会检测版本号,如果有变化,则会清空所有缓存 */
  STORAGE_VERSION: 2020.002,
  /** 谷歌统计id */
  GA_ID: 'UA-173126539-1',
}

// module.exports = PROD_CONDIG
module.exports = UAT_CONFIG
