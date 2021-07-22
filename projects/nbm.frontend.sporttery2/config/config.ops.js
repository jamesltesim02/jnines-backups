const isProd = process.env.NODE_ENV === 'production'

/** 运维配置文件, 非开发环境会屏蔽此文件, 修改后需要重新build */
module.exports = {
  /** 前端服务默认端口号 */
  DEFUALT_PORT: 8702,
  /** 时区偏移值,以分钟为单位,如: 北京/上海 为东八区, 则为 480(8 * 60) */
  TIME_ZONE_OFFSET: 8 * 60,
  /** 商户id */
  FRONT_ID: '100771001skJFqZh',
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
  /** 静态资源地址 */
  RESOURCE_URL: 'https://static-test.nbmm.co/staticrs/',
  /** 多媒体资源地址: 主要针对直播, 赛事flash, br数据统计 */
  MEDIA_URL: 'https://live.hcpkw.cn/',
  /** 接口地址 */
  API_URL: 'https://seamless.nbmm.co/',
  /** 七星彩接口地址 */
  QXC_URL: 'https://nbm-lottery.nbmm.co/',
  /** 比赛信息的CDN地址 */
  MATCH_RESOURCE_URL: 'https://nbm-imgs.nbmm.co/cdn/logo/',
  /** 比赛查询地址 */
  PULL_URL: 'https://hc-pull.nbmm.co/',
  /** 点水地址 */
  QUOTE_URL: 'https://nbm-quote.nbmm.co/',
  /** 投注地址 */
  BET_URL: 'https://nbm-bet.nbmm.co/',
  // BET_URL: 'http://192.168.1.2:18084',
  /** 推送地址 */
  PUSH_URL: 'wss://nbm-push.nbmm.co/websocket/',
  /** 亚游体育地址 */
  AG_SPORTS_URL: 'https://agm.nbmm.co/',

  /** 五大联赛对应id */
  TOP5_TOURS: [
    // 意甲
    '1910047060525056',
    // 英超
    '1910047135760384',
    // 法国甲级联赛
    '1910047155421184',
    // 德国甲级联赛
    '1910047160664064',
    // 西班牙甲级联赛
    '1910047088050176'
  ],
  /** 数字彩票是否开启 */
  DIGITAL_LOTTERY_AVAILABLE: true
}