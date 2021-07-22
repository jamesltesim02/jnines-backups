import BaseApi from "./BaseApi";

import AppConfig from "../configs";

/** 货币类型 */
export enum Currency {
  /** 比特币 */
  BTC = 'BTC',
  /** 泰达币 */
  USDT = 'USDT',
  /** 币付宝 */
  USDT_BFB = 'USDT_BFB',
  /** 小金库 */
  DCBOX = 'DCBOX',
  /** 人民币 */
  CNY = 'CNY',
}

/** 银行卡信息 */
export type BankCard = {
  /** id */
  id: string,
  /** 银行名称 */
  bankName: string,
  /** 银行卡卡号 */
  cardNo: string,
  /** 币种 */
  currency: string,
  /** 优先顺序 */
  def: number,
  /** 是否为默认银行卡 */
  defBank: boolean,
  /** 持卡人姓名 */
  name: string,
  /** 开户省份 */
  province: string,
  /** 开户市 */
  city: string,
  /** 所在支行名称 */
  branch: string,
  /** 账户类型 */
  type: string
};

/** 虚拟币钱包信息 */
export type VirtualWallet = {
  /** id */
  id: string,
  /** 银行名称 */
  bankName: string,
  /** 卡号 */
  cardNo: string,
  /** 币种 */
  currency: string,
  /** 持有人姓名 */
  name: string,
  /** 优先顺序 */
  def: number,
  /** 钱包状态,9:待审批 */
  flag: number,
  /** 钱包协议 */
  walletProtocol: string,
  /** 钱包类型 */
  walletType: string,
};

/** 当前用户的钱包信息 */
export type WalletInfo = {
  /** 已设定的姓名 */
  accountName: string,
  /** 钱包绑定次数，7次以上不显示新增添加银行卡连接 */
  bindCount: number,
  /** 币付宝绑卡开关 (是否有绑定权限) */
  bfbBindSwitch: boolean,
  /** 币付宝开关 (是否维护中) */
  bfbSwitch: boolean,
  /** BTC绑卡开关 (是否有绑定权限) */
  btcBindSwitch: boolean,
  /** BTC开关 (是否维护中) */
  btcSwitch: boolean,
  /** 小金库绑卡开关 (是否有绑定权限) */
  dcBoxBindSwitch: boolean,
  /** 小金库开关 (是否维护中) */
  dcBoxSwitch: boolean,
  /** USDT绑卡开关  (是否有绑定权限)*/
  usdtBindSwitch: boolean,
  /** USDT开关 (是否维护中) */
  usdtSwitch: boolean,
  /**  人民币提款 true：可提款 false：不可提款 */
  cnyWithdrawFlag: boolean,
  /** 已绑定的银行卡列表 */
  banks: Array<BankCard>,
  /** 已经绑定的虚拟币钱包列表 */
  virtual: Array<VirtualWallet>,
};

/** 用户已绑定信息 */
export type VerifyInfo = {
  /** 绑定的手机号 */
  phone: string,
  /** 是否已验证 */
  isVerified: boolean,
  /** 国家编码 */
  countryCode: string,
  /** Google验证起绑定状态 */
  googleBindStatus: boolean,
};

/** 钱包相关接口 */
export default class Wallet extends BaseApi {
  constructor() {
    super({ baseURL: AppConfig.AG_USER_URL });
  }

  /**
   * 查询钱包或银行卡列表
   */
  list(): Promise<WalletInfo> {
    return this._get('bank/bind/list');
    // return Promise.resolve({
    //   "bfbBindSwitch": false,
    //   "btcSwitch": true,
    //   "cnyWithdrawFlag": true,
    //   "virtual": [
    //       {
    //           "flag": 1,
    //           "def": 1,
    //           "walletType": "huobi",
    //           "name": "**芬",
    //           "bankName": "USDT",
    //           "currency": "USDT",
    //           "id": "1000603291",
    //           "cardNo": "******fs",
    //           "walletProtocol": "ERC20"
    //       }
    //   ],
    //   "accountName": "**芬",
    //   "banks": [
    //       {
    //           "def": 1,
    //           "defBank": true,
    //           "province": "北京",
    //           "city": "朝阳",
    //           "name": "**芬",
    //           "bankName": "农业银行",
    //           "currency": "CNY",
    //           "id": "1000227554",
    //           "type": "借记卡",
    //           "branch": "wewqeqw",
    //           "cardNo": "****************22"
    //       },
    //       {
    //           "def": 2,
    //           "defBank": false,
    //           "province": "河南",
    //           "city": "洛阳",
    //           "name": "**芬",
    //           "bankName": "光大银行",
    //           "currency": "CNY",
    //           "id": "1000227568",
    //           "type": "借记卡",
    //           "branch": "是多福多寿",
    //           "cardNo": "****************63"
    //       }
    //   ],
    //   "btcBindSwitch": true,
    //   "usdtBindSwitch": true,
    //   "dcBoxSwitch": true,
    //   "dcBoxBindSwitch": true,
    //   "usdtSwitch": true,
    //   "bindCount": 3,
    //   "bfbSwitch": true
    // });
  }

  /** 查询用户已绑定信息 */
  verifyInfo(): Promise<VerifyInfo> {
    return this._get('bank/init/phone');
  }

  /** 查询USDT钱包详情 */
  queryUsdtWallet(currency: Currency) {
    // if (currency === Currency.USDT) {
    //   return Promise.resolve([
    //     {
    //       "code": "huobi",
    //       "protocolList": [
    //         {
    //           "maxamount": 0,
    //           "minamount": 0,
    //           "payid": "",
    //           "protocol": "ERC20"
    //         },
    //         {
    //           "maxamount": 0,
    //           "minamount": 0,
    //           "payid": "",
    //           "protocol": "OMNI"
    //         }
    //       ],
    //       "sort": 2,
    //       "virtualAccount": "",
    //       "walletName": "火币 Huobi"
    //     },
    //     {
    //       "code": "MOBI",
    //       "protocolList": [
    //         {
    //           "maxamount": 0,
    //           "minamount": 0,
    //           "payid": "",
    //           "protocol": "ERC20"
    //         },
    //         {
    //           "maxamount": 0,
    //           "minamount": 0,
    //           "payid": "",
    //           "protocol": "OMNI"
    //         }
    //       ],
    //       "sort": 4,
    //       "virtualAccount": "",
    //       "walletName": "Mobi"
    //     },
    //     {
    //       "code": "other",
    //       "protocolList": [
    //         {
    //           "maxamount": 0,
    //           "minamount": 0,
    //           "payid": "",
    //           "protocol": "ERC20"
    //         },
    //         {
    //           "maxamount": 0,
    //           "minamount": 0,
    //           "payid": "",
    //           "protocol": "OMNI"
    //         }
    //       ],
    //       "sort": 5,
    //       "virtualAccount": "",
    //       "walletName": "其他钱包"
    //     }
    //   ]);
    // }

    // if (currency === Currency.DCBOX) {
    //   return Promise.resolve([{
    //     "code": "DCBOX",
    //     "protocolList": [
    //       {
    //         "maxamount": 0,
    //         "minamount": 0,
    //         "payid": "",
    //         "protocol": "ERC20"
    //       }
    //     ],
    //     "sort": 0,
    //     "virtualAccount": "",
    //     "walletName": "小金库"
    //   }]);
    // }

    return this._get(
      'payment/wallet',
      { params: { currency } }
    );
  }

  /** 添加虚拟钱包 */
  addVirtual (
    params : {
      /** 钱包类型 */
      walletType: string,
      /** 账号实名，必传 */
      accountName: string,
      /** 货币类型 BTC,USDT,USDT_BFB,USDT_DCBOX */
      currency: string,
      /** 协议 */
      protocol: string,
      /** 钱包地址 */
      accountNo: string,
    }
  ) {
    return this._post(
      'bank/add/virtual',
      params
    );
  }

  /** 注册小金库钱包 */
  dcboxRegister (
    params: {
      countryCode?: string,
      phone?: string,
    }
  ) {
    // return Promise.resolve('QW777814');
    return this._post(
      'bank/dcbox/register',
      params
    );
  }

  /** 银行卡列表 */
  bankList (province?: string) {
    // return Promise.resolve({
    //   "provinces": [
    //     "北京",
    //     "天津",
    //     "河北",
    //     "河南",
    //     "山西",
    //     "内蒙古",
    //     "山东",
    //     "江苏",
    //     "浙江",
    //     "上海",
    //     "安徽",
    //     "辽宁",
    //     "吉林",
    //     "黑龙江",
    //     "广东",
    //     "广西",
    //     "福建",
    //     "海南",
    //     "湖南",
    //     "江西",
    //     "湖北",
    //     "云南",
    //     "贵州",
    //     "四川",
    //     "重庆",
    //     "陕西",
    //     "甘肃",
    //     "宁夏",
    //     "青海",
    //     "新疆",
    //     "西藏"
    //   ],
    //   "bankNames": [
    //     "招商银行",
    //     "工商银行",
    //     "农业银行",
    //     "建设银行",
    //     "交通银行",
    //     "民生银行",
    //     "光大银行",
    //     "兴业银行",
    //     "浦发银行",
    //     "广东发展银行",
    //     "平安银行",
    //     "中国银行",
    //     "邮政储蓄银行",
    //     "华夏银行",
    //     "农村信用社",
    //     "中信银行",
    //     "包商银行",
    //     "北京顺义银座村镇银行",
    //     "北京银行",
    //     "渤海银行",
    //     "沧州银行",
    //     "朝兴银行",
    //     "承德银行",
    //     "成都银行",
    //     "重庆黔江银座村镇银行",
    //     "重庆三峡银行",
    //     "重庆银行",
    //     "重庆渝北银座村镇银行",
    //     "创兴银行",
    //     "村镇银行",
    //     "大华银行",
    //     "大连银行",
    //     "丹东商行",
    //     "大新银行",
    //     "德阳银行",
    //     "德意志银行",
    //     "德州银行",
    //     "东莞银行",
    //     "东亚银行",
    //     "东营莱商村镇银行",
    //     "鄂尔多斯银行",
    //     "法国巴黎银行",
    //     "法国兴业银行",
    //     "富滇银行",
    //     "福建海峡银行",
    //     "抚顺银行",
    //     "阜新银行",
    //     "甘肃银行",
    //     "赣州银行",
    //     "广东南粤银行",
    //     "广发银行",
    //     "广西北部湾银行",
    //     "广州银行",
    //     "桂林银行",
    //     "贵阳银行",
    //     "哈尔滨银行",
    //     "邯郸银行",
    //     "杭州银行",
    //     "汉口银行",
    //     "韩亚银行",
    //     "河北银行",
    //     "恒丰银行",
    //     "恒生银行",
    //     "衡水银行",
    //     "华侨银行",
    //     "花旗银行",
    //     "华融湘江银行",
    //     "华商银行",
    //     "华一银行",
    //     "湖北银行",
    //     "汇丰银行",
    //     "徽商银行",
    //     "葫芦岛银行",
    //     "湖州银行",
    //     "江苏银行",
    //     "江西赣州银座村镇银行",
    //     "嘉兴银行",
    //     "吉林银行",
    //     "晋城银行",
    //     "金华银行",
    //     "济宁银行",
    //     "晋商银行",
    //     "锦州银行",
    //     "九江银行",
    //     "集友银行",
    //     "昆仑银行",
    //     "莱商银行",
    //     "廊坊银行",
    //     "兰州银行",
    //     "辽阳银行",
    //     "临商银行",
    //     "柳州银行",
    //     "龙江银行",
    //     "洛阳银行",
    //     "民泰商行",
    //     "摩根大通银行",
    //     "摩根士丹利国际银行",
    //     "南昌银行",
    //     "南京银行",
    //     "南洋商业银行",
    //     "内蒙古银行",
    //     "宁波通商银行",
    //     "宁波银行",
    //     "宁夏银行",
    //     "农村商业银行",
    //     "农业发展银行",
    //     "盘谷银行",
    //     "平顶山银行",
    //     "齐鲁银行",
    //     "青岛银行",
    //     "青海银行",
    //     "齐商银行",
    //     "企业银行",
    //     "泉州银行",
    //     "日照银行",
    //     "上海银行",
    //     "上饶银行",
    //     "商业银行",
    //     "绍兴银行",
    //     "盛京银行",
    //     "深圳福田银座村镇银行",
    //     "首都银行",
    //     "苏州银行",
    //     "泰京银行",
    //     "台州银行",
    //     "天津银行",
    //     "铁岭银行",
    //     "外换银行",
    //     "潍坊银行",
    //     "温州银行",
    //     "厦门国际银行",
    //     "厦门银行",
    //     "西安银行",
    //     "邢台商行",
    //     "邢台银行",
    //     "星展银行",
    //     "新韩银行",
    //     "新乡银行",
    //     "许昌银行",
    //     "烟台银行",
    //     "营口银行",
    //     "鄞州银行",
    //     "永亨银行",
    //     "友利银行",
    //     "枣庄银行",
    //     "渣打银行",
    //     "长安银行",
    //     "长沙银行",
    //     "浙江景宁银座村镇银行",
    //     "浙江三门银座村镇银行",
    //     "正信银行",
    //     "郑州银行",
    //     "浙商银行",
    //     "中信嘉华银行",
    //     "中原银行",
    //     "驻马店银行"
    //   ]
    // });
    return this._get(
      'bank/provinces/banks',
      { params: { province } }
    );
  }

  /** 查询城市 */
  district (province: string) {
    return this._get(
      'bank/district',
      { params: { province } }
    );
  }

  /** 添加银行卡 */
  addBankcard (
    params: {
      /** 银行账户真实姓名 */
      bankAccountName: string,
      /** 银行卡账号 */
      bankAccountNo: string,
      /** 银行账户类型,可用值:DEBIT,SAVINGS,CREDIT,BITCOIN */
      bankAccountType: string,
      /** 开户银行卡城市 */
      bankCity: string,
      /** 开户银行卡所属省份 */
      bankCountry: string,
      /** 银行名称 */
      bankName: string,
      /** 开户支行名称 */
      branchName: string,
    }
  ) {
    return this._post(
      'bank/add/bank',
      params
    );
  }

  /** 删除钱包 */
  deleteWallet (
    params: {
      id: string,
      currency?: string
    }
  ) {
    return this._get(
      'bank/delete',
      { params }
    );
  }
}
