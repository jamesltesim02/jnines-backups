;(function () {
  // 获取当前地址等操作
  var protocol = location.protocol,
  host = location.host,
  hostname = location.hostname,
  pathname = location.pathname,
  search = location.search,
  hash = location.hash,
  domain = hostname;
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) {
    var ds = domain.split('.');
    domain = Array.prototype.join.call(
      [ds.pop(), ds.pop()].reverse(),
      '.',
    );
  }

  // 配置根属性
  window.NBConfig = {
    //==========================================================
    // 基础属性配置, 平台预设, 商户勿修改
    //==========================================================
    /**
     * FONT_ID对照
     * 亚游: 102001011JIaThBA (B79)
     * 凯时: 1000610117Qe1Gj0 (A06)
     * 酷游: 102061011cYgTGB2 (B06 凯发电游)
     * 永乐: 101031011k3Lx9Tf (E03)
     * 和记: 1010410116Ea5Hq7 (E04)
     * 风暴竞技: 100661011cYsdfsB2
     * 
     * 劲彩现金网: 100771011B79v4yw
     */
    FRONT_ID: '102001011JIaThBA',
    // 默认皮肤 white 白色, dark 黑色
    // THEME: 'white',
    THEME: 'dark',
    // 投注模式
    BETTING_MODE: 2,
    // 投注样式
    BETTING_STYLE: 1,
    // 比赛数据查询接口
    PULL_URL: 'http://pull.nbbets.com/',
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
    // 前端静态资源CDN地址
    STATIC_URL: protocol + '//' + host + '/',
    // 图文直播等动画地址
    LIVE_MEDIA_URL: 'https://uatlive.nbbets.com/',

    //==========================================================
    // 商户相关配置, 由商户提供服务和维护, 商户自行根据需求修改
    //==========================================================
    PORTAL_SETTING: {
      // 商户LOGO地址
      LOGO_URL: 'http://uatm.ag288.com/assets/images/logo.png',
      // 深色商户LOGO地址
      DARK_LOGO_URL: 'http://uatm.ag288.com/assets/images/logo.png',
      // 登陆页面地址
      LOGIN_PAGE_URL: 'http://uatm.ag288.com/login.html',
      // 会员中心地址
      USER_CENTER_URL: 'http://uatm.ag288.com/register.html',
      // 刷新token页面地址
      TOKEN_REFRESH_URL: '',
      // 存款页面
      DEPOSIT_PAGE_URL: 'http://uatm.ag288.com/ucenter/pay/u_deposit.html#kaier_s',
      // 在线客服地址
      SERVICE_CENTER_URL: 'https://ag-customer-service.com/chat/chatClient/chatbox.jsp?companyID=8989&configID=3&skillId=9&enterurl=http%3A%2F%2Fuatm.ag288.com%2Fservice%2Findex.html&info=userId%3D1562812566760%26loginname%3D%E6%B8%B8%E5%AE%A2%26grade%3D0%26name%3D%E6%B8%B8%E5%AE%A2%EF%BC%88%E6%98%9F%E7%BA%A7%3A0%EF%BC%89%26memo%3D%26hashCode%3D415D648B724AA02816A79B725220BF04%26timestamp%3D1562812566760&timestamp=1562812566760',
      // favicon地址
      FAVICON_URL: 'http://uatm.ag288.com/assets/images/favicon.ico',
      // 足球是否已开启让分, 大小
      SOCCER_1618_AVAILABLE: false,
    },
  };
})();