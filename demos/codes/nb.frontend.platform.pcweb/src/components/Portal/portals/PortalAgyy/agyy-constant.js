/**
 * AG业务接口中的常量code
 */
export const AgyyBusinessCodes = {
  // 403 code, 地域限制
  SERVICE_ERROR_403: '1001001',
  // 503 code, 系统维护
  SERVICE_ERROR_503: '1001002',
};

export const AgyyStorageKey = {
  // 密码错误次数key
  LOGIN_ERROR_TIMES_KEY: 'login-error-times',
  // 最后一次登录账号key
  LAST_LOGIN_USERNAME_KEY: 'last-login-username',
  // 最后一次存款类型
  LAST_PAYMENT_TYPE_KEY: 'last-payment-type',
};

/**
 * 商户AG亚游配置信息
 */
export const AgyyConfig = {
  // session 保持间隔时间(15分钟: 1000 * 60 * 15)
  TOKEN_REFERSH_TIME: 900000,
  // 文字验证码模式
  TEXT_CAPTCHA_TYPE: 3,
  // 加密key
  CRYPT_KEY: '63^rt(#)F*Ukg49GK04GB_I09$KG_$4g',
  // 存款 -> 转账 -> 通道类型
  PAYMENT_TRANSFER_TYPES: [
    'transfer_bank',
    // 'transfer_alipay',
    // 'transfer_wechat',
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
