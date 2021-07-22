const isProd = process.env.NODE_ENV === 'production'

/** 运维配置文件, 非开发环境会屏蔽此文件, 修改后需要重新build */
module.exports = {
  /** 商户ID */
  FRONT_ID: '10077100werw564wesfx',
  /** 
   * ### 中断类型  
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
  CDN_URL: isProd ? 'https://ag-statics.nbmm.co/' : 'http://localhost:8600/',
  /** 数据对应资源地址(上传的图片地址) */
  RESOURCE_URL: 'https://ag-imgs.hcdda.cn/cdn/',
  /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
  // MEDIA_URL: 'http://live.hcpkw.cn/',
  // MEDIA_URL: 'https://ag-live.nbmm.co/',
  MEDIA_URL: 'https://live.nbmm.co/',
  /** pull接口地址 */
  PULL_URL: 'https://ag-pull.nbmm.co/',
  /** 投注接口地址 */
  BET_URL: 'https://ag-bet.nbmm.co/',
  /** 点水接口地址 */
  QUOTE_URL: 'https://ag-quote.nbmm.co/',
  /** 推送地址 */
  PUSH_URL: 'wss://ag-push.nbmm.co/websocket/',
  //===================================================================
  /** 登录地址, 只用于前期测试 */
  SIGN_URL: 'https://ag-seamless.nbmm.co/',
  /** 默认的origin地址, 用于跳转到登陆或存取款地址 */
  DEFAULT_ORIGIN: isProd ? 'https://agm.nbmm.co/' : `http://localhost:8600/`,

  /** 红彩前端地址 */
  // HC_URL: 'https://devm.nbmm.co/',

  //===================================================================
  /** 缓存版本号, 页面加载时会检测版本号,如果有变化,则会清空所有缓存 */
  STORAGE_VERSION: 2020.002,
  /** 谷歌统计id */
  GA_ID: 'UA-173126539-1',
}
