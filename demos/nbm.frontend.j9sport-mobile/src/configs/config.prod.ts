const getOrigin = (prefix: string, defaultUrl: string) => {
  const PROMOTE_REGEXP = /^sptm?/i;
  const {
    protocol,
    host
  } = window.location;

  if (!PROMOTE_REGEXP.test(host)) {
    return defaultUrl;
  }

  return `${protocol}//${host.replace(PROMOTE_REGEXP, prefix)}/`;
};

/** 各种地址配置 */
export const Urls = {
  /** pull服务接口, 用于查询数据 */
  PULL: 'https://pullvip.j9vipp8.com/',
  /** 后台系统上传的静态资源CDN地址 */
  /**RESOURCE_URL: 'https://test2-admin.nbmm.co:19000/cdn/',*/
  RESOURCE_URL: 'https://j9-imgs.nbmm.co/cdn/',
  /** 投注接口地址 */
  BET_URL: 'https://j9-bet.nbmm.co/',
  /** 点水接口地址 */
  QUOTE_URL: 'https://j9-quote.nbmm.co/',
  /** 推送地址 */
  PUSH_URL: 'wss://j9-push.nbmm.co/websocket/',
  /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
  MEDIA_URL: 'https://ag-live.nbmm.co/',
  /** 默认origin地址, 用于跳转到登录或者存取款地址 */
  DEFAULT_ORIGIN: getOrigin('www', 'https://www.j92021.com/'),
  /** 1.0 地址 */
  V1_SITE_URL: 'https://web.j9sport.com/',
  /** 登录地址, 只用于前期测试 */
  TEST_SIGN_API_URL: 'https://j9-seamless.nbmm.co/',
};

/** 应用相关配置 */
export const App = {
  /** 系统版本 */
  VERSION: '1.0.0',
  /** 缓存版本,缓存版本变化时会清空浏览器所有缓存内容 */
  CACHE_VERSION: 2020.01,
  /** 前端应用id */
  FRONT_ID: '10077100werw564wesfx',
}
