/**
 * 获取跳转主站的地址
 */
const getOrigin = ()=> {
  /** 目标主站域名规则, 顺序越靠前优先级越高 */
  const ORIGIN_REGEXPS = [
    {
      // 正则表达式,制定需要匹配的规则
      pattern: /j9spt18\.com|j9spt19\.com/gi,
      // 对应的主站域名
      origin: 'https://m.j92021.com/'
    },
    // 最末尾添加一个无pattern的,表示为默认
    // !!! 一定要放到最后, 否则被最先匹配到, 之后的规则将不会被判断
    // !!! 如果前面的所有规则都不匹配, 无论最后一个规则是否有pattern属性, 都会取最后一个
    { origin: 'https://h5.uatnine.com/' }
  ];

  const { host } = window.location;

  if (!ORIGIN_REGEXPS.length) {
    throw new Error('ORIGIN_REGEXPS invalid.')
  }

  let matched = ORIGIN_REGEXPS.find(item => {
    if (typeof item.pattern === 'function') {
      return item.pattern();
    }
    if (typeof item.pattern === 'undefined') {
      return true;
    }
    if (Object.prototype.toString.call(item.pattern) === '[object RegExp]') {
      return item.pattern.test(host);
    }
    return false;
  });

  if (!matched) {
    matched = ORIGIN_REGEXPS[ORIGIN_REGEXPS.length - 1];
  }

  return matched.origin;
};

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
    DEFAULT_ORIGIN: getOrigin(),
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
    FRONT_ID: '10077100werw564wesfx',
    /** 是否为第三方接入模式(国际站) true: 是, false: 否 */
    THIRD_MODE: true,
    /** 快速投注组件是否可用 */
    WIDGET_AVAILABLE: true,
    /** ----------------------------------------------------------- */
    /** 易胜博接入地址 */
    YSB_URL: 'http://mwlrevamp.a1go.org/login.aspx',
    /** 沙巴中文线路地址 */
    SABA_CN_URL: 'http://sbtest.l0107.uatnine.com/deposit_processlogin.aspx',
    /** 沙巴英文线路地址 */
    SABA_US_URL: 'http://sbtest.l0110.uatnine.com/deposit_processlogin.aspx',
    /** Oddin接入地址 */
    ODDIN_URL: 'https://bifrost.integration.oddin.gg',
    /** Oddin商户token */
    ODDIN_BRAND_TOKEN: 'bc58d2f6-86cf-41c0-87c1-fe80ecc5b0e8',
};
