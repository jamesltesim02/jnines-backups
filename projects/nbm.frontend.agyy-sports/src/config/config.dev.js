
const browserLocale = window.navigator.language.split('-')[0] || 'en'

/** 开发配置文件 */
module.exports = {
  /** 系统语言支持 */
  locales: [
    'zh',
    'en',
  ],
  /** 系统默认语言 */
  defaultLocale: browserLocale === 'zh' ? 'zh' : 'en',
  /** 默认接受更高赔率 */
  defaultAC: 1,
  /**
   * 需要提示错误消息的errorCode  
   * 当错误为列表中的code时会自动获取对应错误message并toast提示  
   */
  messageErrorCode: [
    // 失败
    202,
    // 参数错误
    400,
    // 保存数据库失败
    401,
    // 数据格式化错误
    402,
    // 未登录 需要单独处理
    // 403,
    // 数据不存在
    404,
    // 超过截止时间不能发单或跟单, 需要单独处理
    // 470,
    // 数据不存在
    480,
    // 数据已存在
    485,
    // 系统内部错误
    10003,
    // 参数校验错误
    10004,
  ],
  /** 需要单独处理的业务code */
  bussinessCode: {
    /** 地域限制 */
    locationRestricted: "1001001",
    /** 系统维护 */
    systemMaintenance: "1001002",
    /** 需要登录 */
    unauthorized: 401
  },
  /** 查询列表默认参数 */
  pageParams: {
    /** 默认每页10条记录 */
    pageSize: 20,
    /** 默认查询第一条 */
    pageIndex: 1
  },
  /** 需要登录才能访问的地址 */
  needAuth: [
  ],
  /** 可用筹码额度列表 */
  chips: [10, 50, 100, 500, 1000, 5000],
  /** 接口相关 */
  api: {},
  /** 比赛重新加载间隔时间 */
  reloadTime: 1000 * 60 * 10,
  /** 推送相关 */
  push: {
    /** 最大连接重试次数 */
    maxRetryTimes: 5,
    /**
     * 重连时间  
     */
    retryTime: 35000,
    /**
     * 心跳间隔时间  
     * 30秒: 30 * 1000
     */
    dkmTime: 30000,
  },
  /** 投注相关 */
  bet: {
    /** 最低投注额 */
    minBet: 2
  },
  /**
   * ### 当前有效体育类型  
   * * 10 足球   
   * * 11 篮球  
   * * 12 网球  
   * * 13 排球
   * * 14 乒乓球
   * * 15 冰球
   * * 16 棒球
   * * 99 电竞  
   */
  availableSports: [
    // 足球
    10,
    // 篮球
    11,
    // 网球
    12,
    // // 排球
    // 13,
    // // 乒乓球
    // 14,
    // // 冰球
    // 15,
    // // 棒球
    // 16,
    // 电竞  
    99
  ],
  /** 列表上的玩法可选项 */
  listMarkets: [
    // 独赢
    {
      type: 1,
      market: [1, 186],
      text: 'matchs.market1'
    },
    // 让分
    {
      type: 16,
      market: [16],
      text: 'matchs.market16'
    },
    // 大小
    {
      type: 18,
      market: [18],
      text: 'matchs.market18'
    },
  ],
  /** 串关判断表达式 */
  comboPageExp: new RegExp(
    [
      // 球类列表页面
      '(^\\/tab\\/home\\/\\d+?\\/99)',
      // 详情
      '(^\\/match\\/99\\/)',
      // 联赛
      '(^\\/tour\\/\\d+?\\/99\\/)'
    ].join('|'),
    'i'
  ),
  /** 多媒体相关 */
  media: {
    /** 直播地址 */
    video: 'video',
    /** flash地址 */
    lmt: 'lmt'
  },
  /** cdn资源各类型目录 */
  resourceDir: {
    /** 比赛配图 */
    match: 'match',
    /** 联赛logo */
    tour: 'tournament',
    /** 比赛logo */
    competitor: 'competitor',
    /** banner大图 */
    slide: 'slide',
    /** 视频 */
    movie: 'movies'
  },
  /** 主站对应地址 */
  mainSiteUrls: {
    /** 登陆注册 */
    // signin: 'signin',
    signin: '',
    /** 会员中心 */
    member: '/back/?type=13',
    /** 存款 */
    deposit: '/back/?type=6',
  },
  /** 推广视频地址 */
  propagandaVideo: 'publicize0906.mp4',
  /** 活动相关配置 */
  promotions: {
    // 天下第一活动
    top1: {
      /** 活动id */
      actId: 1,
      /** 活动时间：9月16日12:00-10月16日12:00 */
      startTime: new Date('2020/09/26 12:00:00').getTime(),
      limitTime: new Date('2020/10/26 12:00:00').getTime(),
      /** 每页显示条数 */
      pageSize: 30,
    }
  },
}
