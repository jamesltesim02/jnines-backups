/**
 * 本地缓存的key名
 */
export const StorageKey = {
  // 商户idkey
  FRONT_ID_KEY: 'nbjc-front-id',
  // 包壳页面是否是原生
  APP_IS_NATIVE: 'nbjc-is-native',
  // 商户域名key
  PORTAL_DOMAIN_KEY: 'nbjc-portal-domain',
  // 用户信息，格式：{userId:'xxxx',balance:2000,maxRtn:[20000,30000,40000,50000,60000],frontId:123334,token:axjshfsjsjdkzka1938919}
  USER_INFO_KEY: 'nbjc-user',
  // 平台用户相关信息
  MEMBER_INFO_KEY: 'nbjc-member',
  // 用户语言
  LANGUAGE_KEY: 'nbjc-user-language',
  // 用户操作习惯默认配置key
  SETTING_KEY: 'nbjc-user-setting',
  // 购物车key
  BET_CART_KEY: 'nbjc-bet-cart',
  // 新增方案预览key
  BET_TICKET_KEY: 'nbjc-bet-ticket',
  // 受理中投注单key
  BET_OID_KEY: 'nbjc-bet-oid',
  // banner数据key
  SLIDE_DATA_KEY: 'nbjc-slide',
  // 联赛列表key
  TOURNAMENT_LIST_KEY: 'nbjc-tournament-list',
  // 比赛列表key
  MATCH_LIST_KEY: 'nbjc-match-list',
  // 比赛详情key
  MATCH_DETAIL_KEY: 'nbjc-matchdetail',
  // 热门新闻
  HOT_NEWS_LIST_KEY: 'nbjc-hot-news-list',
  // 新闻列表
  NEWS_LIST_KEY: 'nbjc-news-list',
  // 新闻详情
  NEWS_DETAIL_KEY: 'nbjc-news-detail',
  // 商户用户信息key
  CASINO_USER_KEY: 'nbjc-casino-userinfo',
  // 新手教学key
  USER_TEACH_KEY: 'nbjc-user-teach',
  // 用户皮肤key white 白色, black 黑色
  USER_THEME_KEY: 'nbjc-user-theme',
  // Seamless商户的frontId key
  SEAMLESS_FRONTID_KEY: 'nbjc-seamless-frontid',
  // 保存在NB的商户配置信息,从pull接口查询
  PORTAL_SETTING_KEY: 'nbjc-portal-setting',
  // 商户接入时传入的参数信息,包含各种url
  PORTAL_PARAMS_KEY: 'nbjc-portal-params',
  // 商户用户中心token key
  PORTAL_MEMBER_TOKEN: 'nbjc-portal-member-token',
  // 商户账号 key
  PORTAL_LOGIN_NAME: 'nbjc-portal-login-name',
  // 商户3级分销code key
  PORTAL_PALCODE: 'portal-palcode',
  // 商户来源url
  FROM_URL_KEY: 'from-url',
  // 用户是否锁定详情页播放窗口key
  VIDEO_LOCK_KEY: 'nbjc-video-lock',
  // 赛程列表展示样式key
  MATCH_LIST_STYLE_KEY: 'nbjc-match-list-style',
  // 投注模式KEY
  BETTING_MODE_KEY: 'nbjc-betting-model',
  // 最后一次登录账号
  LAST_LOGIN_USERNAME_KEY: 'nbjc-last-login-username',
  // 账号密码错误次数
  LOGIN_ERROR_TIMES_KEY: 'nbjc-login-error-times',
  // AG商户缓存key
  AG_USERINFO_CACHE_KEY: 'nbjc-ag-userinfo',
  // AG存款通道key
  AG_PAYMENT_INFO_KEY: 'nbjc-payment-info',
  // AG最后一次存款类型
  AG_LAST_PAYMENT_TYPE_KEY: 'nbjc-last-payment-type',
  // 扫码用户信息
  SCAN_CODE_USER_KEY: 'nbjc-scan-code-user',
};

/**
 * app类型常量标志
 */
export const AppModes = {
  // 包网模式
  STANDALONE: 1,
  // Seamless模式
  SEAMLESS: 2,
  // 轻量包网模式(亚游接入模式, 会员相关接口用商户)
  STANDALONE_LITE: 3,
};

/**
 * 业务接口中的常量code
 */
export const BusinessCodes = {
  // 403 code, 地域限制
  SERVICE_ERROR_403: '1001001',
  // 503 code, 系统维护
  SERVICE_ERROR_503: '1001002',
};

/**
 * 列表各球类显示玩法信息
 */
export const MATCH_LIST_GAMES = {
  // 足球 1: 胜平负, 2: 让分胜平负
  10: [1, 14],
  // 10: [16, 18],
  // 篮球 16: 让分, 18: 大小, 186: 胜负
  11: [16, 18, 186],
  // 英雄联盟 16: 让分, 186 胜负
  14: [16, 186],
  // 反恐精英 16: 让分, 186 胜负
  17: [16, 186],
};

/**
 * AG业务接口中的常量code
 */
export const AGYYBusinessCodes = {
  // 403 code, 地域限制
  SERVICE_ERROR_403: '1001001',
  // 503 code, 系统维护
  SERVICE_ERROR_503: '1001002',
};

/**
 * 商户AG亚游配置信息
 */
export const PortalAgyyConfig = {
  // 注册验证方式
  REGISTER_TYPE: 2,
  // 加密key
  CRYPT_KEY: '63^rt(#)F*Ukg49GK04GB_I09$KG_$4g',
  // 存款 -> 转账 -> 通道类型
  PAYMENT_TRANSFER_TYPES: [
    'transfer_bank',
    'transfer_alipay',
    'transfer_wechat',
    'transfer_mobile',
  ],
  // 虚拟支付币种类型
  VIRTUAL_CURRENCY: 'BTC',
  // 洗码星级
  REBATE_RULES: [
    // 星级 晋级要求(0首充) 洗码比例
    [1, 0, '0.4%'],
    [2, 10, '0.4%'],
    [3, 50, '0.6%'],
    [4, 100, '0.6%'],
    [5, 300, '0.8%'],
    [6, 600, '0.8%'],
  ],
  // 洗码最低金额
  REBATE_AMOUNT_CONDITION: 10,
  // 在线客服地址
  CUSERVICE: {
    baseUrl: 'https://ag-customer-service.com/chat/chatClient/chatbox.jsp',
    companyID: 8989,
    configID: 3,
    encryptkey: 'ag123456789',
  },
  // 校验正则表达式
  REGEXIES: {
    // 手机号码
    phone: /^(1[3458]\d{9}|17[2-9]\d{8}|19[89]\d{8}|166\d{8})$/,
    // 网络运营商号码
    internetPhone: /^17[01]\d{8}$/,
    // 登录账号
    username: /(^[a|A][s|S|g|G][a-zA-Z0-9]{4,20}$)|(^1[3458]\d{9}|17[2-9]\d{8}|19[89]\d{8}|166\d{8}$)/,
    // 登录密码
    loginPassword: /^[a-zA-Z0-9]{6,10}$/,
    // 注册密码
    registerPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,10}$/,
    // 验证码
    captcha: /^\d{4}$/,
  },
  // 用户注册来源标志
  USER_SOURCE: 'NB',
};

// 支付大类常量
export const PaymentTypes = {
  APP: 'app',
  ALIPAY: 'alipay',
  SCAN: 'scan',
  ONLINE: 'online',
  TRANSFER: 'transfer',
  VIRTUAL: 'virtual',
};

// 支付大类排序
export const PaymentTypeOrder = [
  PaymentTypes.ALIPAY,
  PaymentTypes.SCAN,
  PaymentTypes.APP,
  PaymentTypes.ONLINE,
  PaymentTypes.TRANSFER,
  PaymentTypes.VIRTUAL,
];

// 支付通道排序
export const PaymentChannelOrder = {
  app: ['app_alipay', 'app_big_alipay', 'app_wechat', 'app_big_wechat', 'app_qq'],
  alipay: ['scan_alipay', 'scan_big_alipay'],
  scan: ['scan_wechat', 'scan_big_wechat', 'scan_unionpay', 'scan_qq', 'scan_jd'],
  online: ['online_bank', 'online_unionpay'],
};

// 支付子类到大类的映射
export const PaymentMapping = {
  // APP
  app_alipay: PaymentTypes.APP,
  app_big_alipay: PaymentTypes.APP,
  app_wechat: PaymentTypes.APP,
  app_big_wechat: PaymentTypes.APP,
  app_qq: PaymentTypes.APP,
  // 支付宝
  scan_alipay: PaymentTypes.ALIPAY,
  scan_big_alipay: PaymentTypes.ALIPAY,
  // 扫码支付
  scan_wechat: PaymentTypes.SCAN,
  scan_big_wechat: PaymentTypes.SCAN,
  scan_unionpay: PaymentTypes.SCAN,
  scan_qq: PaymentTypes.SCAN,
  scan_jd: PaymentTypes.SCAN,
  // 在线支付
  online_bank: PaymentTypes.ONLINE,
  online_unionpay: PaymentTypes.ONLINE,
  // 银行卡转账
  transfer: PaymentTypes.TRANSFER,
  // 虚拟支付
  virtual_btc: PaymentTypes.VIRTUAL,
};

// 提交存款订单的payType
export const PaymentPayType = {
  // APP
  app_alipay: 'ALIPAY_APP',
  app_big_alipay: 'BIG_ALIPAY_APP',
  app_wechat: 'WECHAT_APP',
  app_big_wechat: 'BIG_WECHAT_APP',
  app_qq: 'QQ_APP',
  // 支付宝
  scan_alipay: 'ALIPAY_QR',
  scan_big_alipay: 'BIG_ALIPAY_QR',
  // 扫码支付
  scan_wechat: 'WECHAT_QR',
  scan_big_wechat: 'BIG_WECHAT_QR',
  scan_jd: 'ONLINE_JD_QR',
  scan_qq: 'QQ_QR',
  scan_unionpay: 'ONLINE_UNIONPAY_QR',
  // 在线支付
  online_bank: 'ONLINE_BANK',
  online_unionpay: 'ONLINE_PLATFORM',
  // 银行卡转账
  // transfer: PaymentTypes.TRANSFER,
  transfer_bank: 1,
  transfer_alipay: 2,
  transfer_wechat: 3,
  transfer_mobile: 4,
  // 虚拟支付
  // virtual_btc: PaymentTypes.VIRTUAL,
};

/**
 * 开放的体育类型列表
 *
 *   10 = Soccer 足球
 *   11 = Basketball 篮球
 *   12 = Tennis 网球
 *   13 = 台球
 *   14 = LOL 英雄联盟
 *   15 = Dota2 刀塔2
 *   16 = ArenaOfValor 王者荣耀
 *   17 = CounterStrike 反恐精英
 *   18 = StarCraft 星际争霸
 *   19 = Overwatch 守望先锋
 *   20 = 乒乓
 *   21 = 保龄球
 *   22 = 拳击
 *   23 = 排球
 *   24 = 橄榄球
 *   25 = 羽毛球
 *   26 = 高尔夫
 */
export const SportsList = [
  // 10 = Soccer 足球
  {
    sno: 10,
    visible: true,
    available: true,
  },
  // 11 = Basketball 篮球
  {
    sno: 11,
    visible: true,
    available: true,
  },
  // 12 = Tennis 网球 (暂不支持) *
  {
    sno: 12,
    visible: true,
    available: true,
  },
  // 13 = 台球 (暂不支持)
  // {
  //   sno: 13,
  //   visible: true,
  //   available: true,
  // },
  // // 14 = LOL 英雄联盟 *
  // {
  //   sno: 14,
  //   visible: true,
  //   available: true,
  // },
  // // 15 = Dota2 刀塔2 (暂不支持)
  // {
  //   sno: 15,
  //   visible: true,
  //   available: true,
  // },
  // // 16 = ArenaOfValor 王者荣耀 (暂不支持)
  // {
  //   sno: 16,
  //   visible: true,
  //   available: true,
  // },
  // // 17 = CounterStrike 反恐精英
  // {
  //   sno: 17,
  //   visible: true,
  //   available: true,
  // },
  // // 18 = StarCraft 星际争霸 (暂不支持) *
  // {
  //   sno: 18,
  //   visible: true,
  //   available: true,
  // },
  // // 19 = Overwatch 守望先锋 (暂不支持)
  // {
  //   sno: 19,
  //   visible: true,
  //   available: true,
  // },
  // // 20 = 乒乓
  // {
  //   sno: 20,
  //   visible: true,
  //   available: true,
  // },
  // // 21 = 保龄球
  // {
  //   sno: 21,
  //   visible: true,
  //   available: true,
  // },
  // // 22 = 拳击
  // {
  //   sno: 22,
  //   visible: true,
  //   available: true,
  // },
  // // 23 = 排球
  // {
  //   sno: 23,
  //   visible: true,
  //   available: true,
  // },
  // // 24 = 橄榄球
  // {
  //   sno: 24,
  //   visible: true,
  //   available: true,
  // },
  // // 25 = 羽毛球
  // {
  //   sno: 25,
  //   visible: true,
  //   available: true,
  // },
  // // 26 = 高尔夫
  // {
  //   sno: 26,
  //   visible: true,
  //   available: true,
  // },
];
