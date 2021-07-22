/** 开发配置文件 */
module.exports = {
  /** 系统语言支持 */
  locales: [
    'zh-CN',
    'zh-TW',
    'en-US'
  ],
  /** 系统默认语言 */
  defaultLocale: 'zh-CN',
  /**
   * 需要提示错误消息的errorCode  
   * 当错误为列表中的code时会自动获取对应错误message并toast提示  
   */
  messageErrorCode: [
    // 失败
    202,
    // 参数错误
    400,
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
    // 发单失败
    10050,
  ],
  /** 需要单独处理的业务code */
  bussinessCode: {
    /** 地域限制 */
    locationRestricted: 403,
    /** 系统维护 */
    systemMaintenance: 503,
    /** 需要登录 */
    unauthorized: 401
  },
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
  /** 查询列表默认参数 */
  pageParams: {
    /** 默认每页10条记录 */
    pageSize: 20,
    /** 默认查询第一条 */
    pageIndex: 1
  },
  /** 跟单单注金额 */
  baseBet: 2,
  /** 投注 可选倍数 */
  followValues: [10, 20, 50, 100, 500],
  /** 需要登录才能访问的地址 */
  needAuth: [
    // 会员中心及相关页面
    /^\/profile.*/i,
    // 勋章及相关页面
    /^\/medal.*/i,
    // 订单及相关页面
    /^\/betslip.*/i
  ],
  /** 亚游相关配置 */
  ag8: {
    /** 登录 */
    signin: 'login/login.html',
    /** 注册 */
    signup: 'register/register.html',
    /** 客服 */
    service: 'service/index.html',
    /** 存款 */
    saving: 'ucenter/pay/u_deposit.html#bankcardsave.html',
    /** 提现 */
    withdrawal: 'ucenter/withdrawal/u_withdrawal.html',
    /** 设置 */
    setting: 'ucenter/account/set_account.html',
    /** 我的任务 */
    task: 'ucenter/mission/',
    /** 交易记录 */
    amountRecords: 'ucenter/transaction/u_transaction.html',
    /** 手机验证 */
    phoneValidation: 'ucenter/phone/u_verify_phone.html',
  },
  /** 多媒体相关 */
  media: {
    /** 直播地址 */
    video: 'video',
    /** flash地址 */
    lmt: 'lmt'
  },
  /** 数字彩单注金额 */
  qxcBaseAmount: 2
}
