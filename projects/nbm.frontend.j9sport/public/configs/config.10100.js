function getOrigin (prefix, defaultUrl)  {
  var PROMOTE_REGEXP = /^sptm?/i;
  var protocol = window.location.protocol;
  var host = window.location.host;

  if (!PROMOTE_REGEXP.test(host)) {
    return defaultUrl;
  }

  return protocol + '://' + host.replace(PROMOTE_REGEXP, prefix) + '/';
}

window.__J9S_CONFIG__ = {
    /** pull服务接口, 用于查询数据 */
    PULL: 'https://j9-pull.nbmm.co/',
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
    DEFAULT_ORIGIN: getOrigin('www', 'https://pc.uatnine.com/'),
    /** 主站用户相关请求地址 */
    AG_USER_URL: 'https://j9-users.nbmm.co/',
    /** 登录地址, 只用于前期测试 */
    SIGN_URL: 'https://j9-seamless.nbmm.co/',
    /** 用户行为统计上报地址 */
    COLLECT_URL: 'https://ja.nbmm.co/',
    /** 第三方游戏注单查询接口 */
    THIRD_URL: 'https://j9-thirdapi.nbmm.co/',
    /** 主题活动接口 */
    THEME_URL: 'https://j9-jc.nbmm.co/',
    /** ----------------------------------------------------------- */
    /** 系统版本 */
    VERSION: '1.0.0',
    /** 前端应用id */
    FRONT_ID: '10100100werw564wesfx',
    /** 是否为第三方接入模式(国际站) true: 是, false: 否 */
    THIRD_MODE: true,
    /** 快速投注组件是否可用 */
    WIDGET_AVAILABLE: true,
    /** ----------------------------------------------------------- */
    /** 易胜博接入地址 */
    YSB_URL: 'http://wlrevamp.a1go.org/login.aspx',
    /** 沙巴中文线路地址 */
    SABA_CN_URL: 'http://sbtest.l0107.uatnine.com/deposit_processlogin.aspx',
    /** 沙巴英文线路地址 */
    SABA_US_URL: 'http://sbtest.l0110.uatnine.com/deposit_processlogin.aspx',
    /** Oddin接入地址 */
    ODDIN_URL: 'https://bifrost.integration.oddin.gg/',
    /** Oddin商户token */
    ODDIN_BRAND_TOKEN: 'bc58d2f6-86cf-41c0-87c1-fe80ecc5b0e8',
};
