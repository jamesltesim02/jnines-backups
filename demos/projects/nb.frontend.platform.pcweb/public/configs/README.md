# frontId 列表 
    亚游: 102001011JIaThBA (B79)
    凯时: 1000610117Qe1Gj0 (A06)
    酷游: 102061011cYgTGB2 (B06 凯发电游)
    永乐: 101031011k3Lx9Tf (E03)
    和记: 1010410116Ea5Hq7 (E04)
    劲彩现金网: 100771011B79v4yw

# 配置说明 
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
        domain = Array.prototype.join.call([ds.pop(), ds.pop()].reverse(), '.');
      }

      // 配置根属性
      window.NBConfig = {
        //==========================================================
        // 基础属性配置, 平台预设, 商户勿修改
        //==========================================================
        // 应用模式
        APP_MODE: 2,
        // 商户id
        FRONT_ID: '100771011B79v4yw',
        // 投注模式
        BETTING_MODE: 3,
        // 是否允许同场比赛选择多个投注项
        ALLOW_SAME_MATCH: true,
        // 是否允许单式投注时同时投注多个投注项
        ALLOW_MULT_OPTION: true,
        // 串关时最多可选的投注项
        MAX_BETTING_COUNT: 10,
        // 串关注单是否拆分
        FOLDS_NEED_SPLIT: false,

        //==========================================================
        // 网络地址配置, 平台预设, 必要时平台会通知商户做响应修改调整
        //==========================================================
        // 比赛数据查询接口
        PULL_URL: 'https://nbpull.nbbets.com/',
        // 点水接口
        QUOTE_URL: 'https://nbsalesrisk.nbbets.com/',
        // 投注接口
        BET_URL: 'https://nbbet.nbbets.com/api/bet/',
        // 提前结算查询接口
        CASH_URL: 'https://nbsettlement.nbbets.com/',
        // 推送接口
        PUSH_URL: 'wss://nbpush.nbbets.com/ws',
        // 后台配置的静态文件cdn地址
        RESOURCE_URL: 'https://nbimges.nbbets.com/cdn/',
        // 前端静态资源CDN地址
        STATIC_URL: protocol + '//' + host + '/',
        // 图文直播等动画地址
        LIVE_MEDIA_URL: 'http://media.nbbets.com/',

        //==========================================================
        // 商户相关配置, 由商户提供服务和维护, 商户自行根据需求修改
        //==========================================================
        PORTAL_SETTING: {
          // 商户LOGO地址
          LOGO_URL: 'http://user.nbbets.com/logo.png',
          // 登陆页面地址
          LOGIN_PAGE_URL: 'http://user.nbbets.com/#/login',
          // 会员中心地址
          USER_CENTER_URL: 'http://user.nbbets.com/#/member',
          // 刷新token页面地址
          TOKEN_REFRESH_URL: 'http://user.nbbets.com/#/refreshToken',
          // 存款页面
          DEPOSIT_PAGE_URL: 'http://user.nbbets.com/#/deposit',
          // 在线客服地址
          SERVICE_CENTER_URL: 'http://user.nbbets.com/#/onlneService,
          // favicon地址
          FAVICON_URL: ' http://user.nbbets.com/favicon.ico',
          // 足球是否已开启让分, 大小
          SOCCER_1618_AVAILABLE: false,
        },
      };
    });
