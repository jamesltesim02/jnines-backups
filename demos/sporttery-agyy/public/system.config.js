// ;(function () {
//   window.NBConfig = {
//     /**
//      * 应用模式
//      * 1: 包网
//      * 2: Seamless模式
//      * 3: 轻量包网模式(亚游接入模式, 会员相关接口用商户)
//      *
//      * 业务代码中进行比较判断时需要使用constants.js中的AppModels常量来判断
//      * 不建议在代码中硬编码
//      */
//     APP_MODE: 3,
//     // 前端id (劲彩-移动端)
//     // FRONT_ID: '100771011B79v4yw',
//     // FRONT_ID: '100771001mi81dZM',
//     // AGYY front_id
//     FRONT_ID: '102001001JIaThBA',
//     // 默认皮肤 white 白色, black 黑色
//     THEME: 'black',
//     /**
//      * 赛程列表展示样式
//      * 1: 宽松两胜平负盘口样式
//      * 2: 紧凑两胜平负盘口样式
//      * 3: 紧凑单盘口样式
//      * 4: 宽松让分大和小盘口样式
//      */
//     MATCH_LIST_STYLE: 1,
//     /**
//      * 投注模式
//      * 1: 小白模式
//      * 2: 专家模式
//      */
//     BETTING_MODE: 1,
//     // 现金网接口
//     CASINO_API_URL: 'http://casino.nbbets.com/',
//     // 比赛数据查询接口
//     // PULL_URL: 'http://pull.nbbets.com/',
//     PULL_URL: 'http://pull.nbsport88.com',
//     // 点水接口
//     QUOTE_URL: 'http://salesrisk.nbbets.com/',
//     // 投注接口
//     BET_URL: 'http://bet.nbbets.com/api/bet/',
//     // 提前结算查询接口
//     CASH_URL: 'http://settlement.nbbets.com/',
//     // 推送接口
//     PUSH_URL: 'push.nbbets.com/ws',
//     // 后台配置的静态文件cdn地址
//     RESOURCE_URL: 'http://imges.nbbets.com/cdn/',
//     // 前端静态资源CDN地址
//     STATIC_URL: 'http://10.96.52.35:8080/',
//     // 图文直播等动画地址
//     LIVE_MEDIA_URL: 'http://m.nbbets.com/',
//     // 商户api地址
//     PORTAL_API_URL: 'http://uatm.ag288.com/',
//     // PORTAL_API_URL: 'http://10.96.52.24:8080/sport_api/',
//     /**
//      * 开放的体育类型列表
//      * 
//      *   10 = Soccer 足球
//      *   11 = Basketball 篮球
//      *   12 = Tennis 网球 (暂不支持)
//      *   14 = LOL 英雄联盟
//      *   15 = Dota2 刀塔2
//      *   16 = ArenaOfValor 王者荣耀
//      *   17 = CounterStrike 反恐精英
//      *   18 = StarCraft 星际争霸
//      *   19 = Overwatch 守望先锋
//      */
//     AVAILABLE_SPORTS: [
//       10,
//       11,
//       14,
//       15,
//       16,
//       17,
//       18,
//       19,
//     ],
//   };
// })();

;(function () {

  window.NBConfig = {
    /**
     * 应用模式
     * 1: 包网
     * 2: Seamless模式
     * 3: 轻量包网模式(亚游接入模式, 会员相关接口用商户)
     *
     * 业务代码中进行比较判断时需要使用constants.js中的AppModels常量来判断
     * 不建议在代码中硬编码
     */
    APP_MODE: 3,
    // 前端id (劲彩-移动端)
    FRONT_ID: '102001011JIaThBA',
    // FRONT_ID: '100771001mi81dZM',
    // 默认皮肤 white 白色, black 黑色
    THEME: 'black',
    /**
     * 赛程列表展示样式
     * 1: 宽松两胜平负盘口样式
     * 2: 紧凑两胜平负盘口样式
     * 3: 紧凑单盘口样式
     * 4: 宽松让分大和小盘口样式
     */
    MATCH_LIST_STYLE: 1,
    /**
     * 投注模式
     * 1: 小白模式
     * 2: 专家模式
     */
    BETTING_MODE: 1,
    // 现金网接口
    CASINO_API_URL: 'http://casino.nbbets.com/',
    // 比赛数据查询接口
    PULL_URL: 'http://pull.nbbets.com/',
    // PULL_URL: 'http://10.96.52.24:8080/nb_sport_pull/',
    // 点水接口
    QUOTE_URL: 'http://salesrisk.nbbets.com/',
    // 投注接口
    BET_URL: 'http://bet.nbbets.com/api/bet/',
    // 提前结算查询接口
    CASH_URL: 'http://settlement.nbbets.com/',
    // 推送接口
    PUSH_URL: 'push.nbbets.com/ws',
    // 后台配置的静态文件cdn地址
    RESOURCE_URL: 'http://imges.nbbets.com/cdn/',
    // 前端静态资源CDN地址
    STATIC_URL: 'http://cor.nbbets.com',
    // 图文直播等动画地址
    LIVE_MEDIA_URL: 'http://cor.nbbets.com/',
    // 商户api地址
    PORTAL_API_URL: 'http://uatm.ag288.com/',
    /**
     * 开放的体育类型列表
     * 
     *   10 = Soccer 足球
     *   11 = Basketball 篮球
     *   12 = Tennis 网球 (暂不支持)
     *   14 = LOL 英雄联盟
     *   15 = Dota2 刀塔2
     *   16 = ArenaOfValor 王者荣耀
     *   17 = CounterStrike 反恐精英
     *   18 = StarCraft 星际争霸
     *   19 = Overwatch 守望先锋
     */
    AVAILABLE_SPORTS: [
      10,
      11,
      14,
      17,
      15,
      16,
      18,
      19,
    ],
  };
})();

