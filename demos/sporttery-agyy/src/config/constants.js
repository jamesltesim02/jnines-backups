/**
 * 本地缓存的key名
 */
export const StorageKey = {
  // 用户信息，格式：{userId:'xxxx',balance:2000,maxRtn:[20000,30000,40000,50000,60000],frontId:123334,token:axjshfsjsjdkzka1938919}
  USER_INFO_KEY: 'nbjc-user',
  // 用户语言
  LANGUAGE_KEY: 'nbjc-user-language',
  // 用户操作习惯默认配置key
  SETTING_KEY: 'nbjc-user-setting',
  // 购物车key
  BET_CART_KEY: 'nbjc-bet-cart',
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
  // 用户皮肤key white 白色, black 黑色
  USER_THEME_KEY: 'nbjc-user-theme',
  // Seamless商户的frontId key
  SEAMLESS_FRONTID_KEY: 'nbjc-seamless-frontid',
  // 保存在NB的商户配置信息,从pull接口查询
  PORTAL_SETTING_KEY: 'nbjc-portal-setting',
  // 商户接入时传入的参数信息,包含各种url
  PORTAL_PARAMS_KEY: 'nbjc-portal-params',
  // 赛程列表展示样式KEY
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
 * 各体育联赛标志颜色
 */
export const SportsColors = {
  // 足球
  10: {
    // 英格兰超级联赛 4467826303959040 #5fd78d
    4467826303959040: '#5fd78d',
    // 英格兰冠军联赛 4467861251948545 #4fbe7a
    4467861251948545: '#4fbe7a',
    // 德国甲级联赛 4467872553238528 #e35c5c
    4467872553238528: '#e35c5c',
    // 德国乙级联赛 4585083807727616 #d6798b
    4585083807727616: '#d6798b',
    // 义大利甲级 4467869017178112   #d7ca5f
    4467869017178112: '#d7ca5f',
    // 法国甲级 4467866428768256    #bfd2e2
    4467866428768256: '#bfd2e2',
    // 法国乙级 4467824537370624    #a7baca
    4467824537370624: '#a7baca',
    // * 西班牙甲级 4467863181066241    #e49769
    4467863181066241: '#e49769',
    // 中超(中国足协杯) 4663711520522240        #e4cb69
    4663711520522240: '#e4cb69',
    // 日J1 4671820866781186        #c9c9c9
    4671820866781186: '#c9c9c9',
    // 韩国职业(韩国K1联赛) 4671824945741824    #6f8ac6
    4671824945741824: '#6f8ac6',
    // 欧足联(欧足联国家联赛) 4494571063214080       #e9b83e
    4494571063214080: '#e9b83e',
    // 其他         #e6cbdc
    others: '#e6cbdc',
    // - 义大利乙级   #c2b54c
    // * 西班牙乙级     #c47f56
    // - 巴西甲级     #6fa6c6
    // - 挪威甲级     #e14b5f
    // - 亚冠         #5fc1d7
    // 欧冠        #c8cdd8
  },
  // 篮球
  11: {
    // NBA 4470496797130752         #e35c5c
    4470496797130752: '#e35c5c',
    // 欧洲篮球联赛 4555640951537664  #e4cb69
    4555640951537664: '#e4cb69',
    // - 其他          #bfd2e2
    others: '#bfd2e2',
    // - CBA          #e9b83e
    // - 德国甲级联赛  #6f8ac6
    // - 义大利蓝甲    #d7ca5f
    // - 东南亚篮球联赛 #ffe373
    // - 法蓝甲级      #5fc1d7
    // - 西蓝甲        #6fa6c6
    // - 其他          #bfd2e2
  },
  // 其他
  others: {
    // 其他         #e6cbdc
    others: '#e6cbdc',
  },
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
