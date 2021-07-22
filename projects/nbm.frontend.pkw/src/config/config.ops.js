// const isProd = process.env.NODE_ENV === 'production'

// /** 运维配置文件, 非开发环境会屏蔽此文件, 修改后需要重新build */
// module.exports = {
//   // 本站相关配置
//   //==================================================================
//   /** 前端服务默认端口号 */
//   DEFUALT_PORT: 8900,
//   /** 商户ID */
//   FRONT_ID: '10077100werw564wesfx',
//   /** 
//    * ### 中断类型  
//    *
//    * 1: MoH5-手机端H5  
//    * 2: PcH5-PC端H5  
//    * 3: AndroidApp-android客户端  
//    * 4: AndroidH5-android H5  
//    * 5: IosApp-android客户端   
//    * 6: IosH5-android H5  
//    * 7: QMoH5-快捷投注手机H5  
//    * 8: QPcH5-快捷投注PCH5  
//    * 9: Cocos-游戏终端  
//    */
//   CLIENT_TYPE: 1,
//   /** cdn地址 */
//   CDN_URL: isProd ? '' : '',
//   // /** 数据对应资源地址(上传的图片地址) */
//   // RESOURCE_URL: 'https://pkw-imgs.hcdda.cn/cdn/logo/',
//   // // RESOURCE_URL: 'https://pkw-imgs.hcdda.cn/cdn/logo/',
//   // /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
//   // MEDIA_URL: 'https://live.nbmm.co/',
//   // /** pull接口地址 */
//   // PULL_URL: 'https://pkw-pull.nbmm.co/',
//   // // PULL_URL: 'https://nbm-api.irknow.com/pull/',
//   // /** 投注接口地址 */
//   // BET_URL: 'https://pkw-bet.nbmm.co/',
//   // // BET_URL: 'https://nbm-api.irknow.com/bet/',
//   // /** 点水接口地址 */
//   // QUOTE_URL: 'https://pkw-quote.nbmm.co/',
//   // // QUOTE_URL: 'https://nbm-api.irknow.com/quote/',
//   // /** 推送地址 */
//   // PUSH_URL: 'wss://pkw-push.nbmm.co/websocket/',
//   // // PUSH_URL: 'wss://nbm-api.irknow.com/push/websocket/',
//   //===================================================================

//     // RESOURCE_URL: 'http://8.210.137.211/cdn/logo/',
//     RESOURCE_URL: 'https://pkw-imgs.hcdda.cn/cdn/logo/',
//     /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
//     // MEDIA_URL: 'http://media.pkk777.com',
//     MEDIA_URL: 'https://live.nbmm.co/',
//     /** pull接口地址 */
//     PULL_URL: 'https://pkw-pull.nbmm.co/',
//     // PULL_URL: 'http://8.210.189.168/pull/',
//     /** 投注接口地址 */
//     BET_URL: 'https://pkw-bet.nbmm.co/',
//     // BET_URL: 'http://8.210.189.168/bet/',
//     /** 点水接口地址 */
//     QUOTE_URL: 'https://pkw-quote.nbmm.co/',
//     // QUOTE_URL: 'http://8.210.189.168/quote/',
//     /** 推送地址 */
//     PUSH_URL: 'wss://pkw-push.nbmm.co/websocket/',
//     // PUSH_URL: 'ws://8.210.189.168/push/websocket/',

//   // //===================================================================


//   /** 登录地址, 只用于前期测试 */
//   SIGN_URL: 'https://pkw-seamless.nbmm.co/'
//   // SIGN_URL: ' https://nbm-api.irknow.com/seamless/'
// }



const isProd = process.env.NODE_ENV === 'production'

/** 运维配置文件, 非开发环境会屏蔽此文件, 修改后需要重新build */
module.exports = {
  // 本站相关配置
  //==================================================================
  /** 前端服务默认端口号 */
  DEFUALT_PORT: 80,
  /** 商户ID */
  FRONT_ID: '10077100werw564wesfx',
  /** 
   * ### 中断类型  
   *
   * 1: MoH5-手机端H5  
   * 2: PcH5-PC端H5  
   * 3: AndroidApp-android客户端  
   * 4: AndroidH5-android H5  
   * 5: IosApp-android客户端   
   * 6: IosH5-android H5  
   * 7: QMoH5-快捷投注手机H5  
   * 8: QPcH5-快捷投注PCH5  
   * 9: Cocos-游戏终端  
   */
  CLIENT_TYPE: 1,
  /** cdn地址 */
  CDN_URL: isProd ? '' : '',
  /** 数据对应资源地址(上传的图片地址) */
  // RESOURCE_URL: 'https://pkw-imgs.hcdda.cn/cdn/logo/',
  RESOURCE_URL: 'https://a93s-images.sanmuhbkj.com/cdn/logo/',
  /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
  MEDIA_URL: 'http://media.pkw0.com/',
  /** pull接口地址 */
  // PULL_URL: 'https://pkw-pull.nbmm.co/',
  PULL_URL: 'http://8.210.189.168/pull/',
  /** 投注接口地址 */
  // BET_URL: 'https://pkw-bet.nbmm.co/',
  BET_URL: 'http://8.210.189.168/bet/',
  /** 点水接口地址 */
  // QUOTE_URL: 'https://pkw-quote.nbmm.co/',
  QUOTE_URL: 'http://8.210.189.168/quote/',
  /** 推送地址 */
  // PUSH_URL: 'wss://pkw-push.nbmm.co/websocket/',
  PUSH_URL: 'ws://8.210.189.168/push/websocket/',
  //===================================================================

  /** 登录地址, 只用于前期测试 */
  // SIGN_URL: 'https://pkw-seamless.nbmm.co/'
  SIGN_URL: ' http://47.52.100.78/wepoker/'

}
