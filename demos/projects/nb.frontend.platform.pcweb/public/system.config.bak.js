;(function () {
  var protocol = location.protocol,
  host = location.host,
  hostname = location.hostname,
  search = location.search,
  hash = location.hash,
  domain = hostname;
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) {
    var ds = domain.split('.');
    domain = Array.prototype.join.call([ds.pop(), ds.pop()].reverse(), '.');
  }

  window.NBConfig = {
    /**
     * FONT_ID对照
     * 亚游: 102001011JIaThBA (B79)
     * 凯时: 1000610117Qe1Gj0 (A06)
     * 酷游: 102061011cYgTGB2 (B06 凯发电游)
     * 和记: 1010410116Ea5Hq7 (E03)
     * 永乐: 101031011k3Lx9Tf (E04)
     */
    FRONT_ID: '102001011JIaThBA',
    // 比赛数据查询接口
    PULL_URL: 'http://pull.nbbets.com/',
    // PULL_URL: 'https://pull.agvipp8.com/',
    // 点水接口
    QUOTE_URL: 'http://salesrisk.nbbets.com/',
    // 投注接口
    BET_URL: 'http://bet.nbbets.com/api/bet/',
    // 提前结算查询接口
    CASH_URL: 'http://settlement.nbbets.com/',
    // 推送接口
    PUSH_URL: 'ws://push.nbbets.com/ws',
    // 后台配置的静态文件cdn地址
    RESOURCE_URL: 'http://imges.nbbets.com/cdn/',
    // RESOURCE_URL: 'https://imgs.nb668.cn/cdn/',
    // 前端静态资源CDN地址
    STATIC_URL: protocol + '//' + host + '/',
    // STATIC_URL: 'https://ijc888.com/',
    // 图文直播等动画地址
    LIVE_MEDIA_URL: 'https://uatlive.nbbets.com/',
    // LIVE_MEDIA_URL: 'http://cor.nbbets.com/',
    // LIVE_MEDIA_URL: 'http://sir.nbbets.com/',
    // 商户api地址
    // PORTAL_API_URL: 'http://uatnb.ag288.com/',
    // PORTAL_API_URL: 'http://uat.ag288.com/',
    PORTAL_API_URL: protocol + '//' + host + '/',
    /**
     * 开放的体育类型列表
     * 
     *   10 = Soccer 足球
     *   11 = Basketball 篮球
     *   12 = Tennis 网球 (暂不支持)
     *   14 = LOL 英雄联盟
     *   15 = Dota2 刀塔2 (暂不支持)
     *   16 = ArenaOfValor 王者荣耀 (暂不支持)
     *   17 = CounterStrike 反恐精英
     *   18 = StarCraft 星际争霸 (暂不支持)
     *   19 = Overwatch 守望先锋 (暂不支持)
     */
    AVAILABLE_SPORTS: [
      10,
      11,
      14,
      17,
    ],
    // 以下都为商户自定义项，不配用默认的
    PORTAL_SETTING: {
      BET_SELECT: {
        fast: [50, 100, 200, 300, 500],
        blockade: [2, 5, 10, 50, 100],
        jackpot: [50, 100, 200, 300, 500],
      },
      DEFAULT: {
        SOCCER_1618_AVAILABLE: false,
      },
      /**
       * 针对开发环境配置(生产环境只需要配置DEFAULT)
       * FONT_ID对照
       * 亚游: 102001011JIaThBA (B79)
       * 凯时: 1000610117Qe1Gj0 (A06)
       * 酷游: 102061011cYgTGB2 (B06 凯发电游)
       * 和记: 1010410116Ea5Hq7 (E03)
       * 永乐: 101031011k3Lx9Tf (E04)
       */
      // '102001011JIaThBA': {
        // LOGO_URL: '',
        // LOGIN_PAGE_URL: 'http://10.96.52.35:3000/sign/in',
        // REGISTER_PAGE_URL: 'http://10.96.52.35:3000/sign/up',
        // USER_CENTER_URL: 'http://10.96.52.35:3000/member',
        // TOKEN_REFRESH_URL: 'http://10.96.52.35:3000/refreshToken',
        // DEPOSIT_PAGE_URL: 'http://10.96.52.35:3000/deposit',
        // PROMOTION_PAGE_URL: '',
        // FAVICON_URL: '',
        // SERVICE_CENTER_URL: '',
      // },
    },
  };
})();