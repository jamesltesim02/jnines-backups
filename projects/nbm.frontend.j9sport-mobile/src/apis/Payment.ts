import BaseApi from "./BaseApi";

import AppConfig from "../configs";

/**
 * 充值类型枚举
 *
 * * DC_BOX - dcBox - 小金库
 * * SCAN_PAYMENT - scan - USDT 其他钱包充值类型名
 * * ALIPAY - alipay - 支付宝
 * * BANK_CARD - bankcar - 人民币充值
 */
export enum PaymentGenres {
  /** 小金库 */
  DC_BOX = 'dcBox',
  /** USDT 其他钱包充值类型名 */
  SCAN_PAYMENT = 'scan',
  /** 支付宝 */
  ALIPAY = 'alipay',
  /** 人民币充值 */
  BANK_CARD = 'bankcard'
}

/**
 * ### 支付协议
 *
 * * payId: 支付id
 * * name: 协议名称
 * * maxAmount: 最大金额
 * * minAmount: 最小金额
 * * base64Qrcode: BASE64二维码链接
 * * qrCode: 二维码链接
 */
export type PaymentProtocol = {
  /** 支付id */
  payId: string,
  /** 协议名称 */
  name: string,
  /** 最大金额 */
  maxAmount: number,
  /** 最小金额 */
  minAmount: number,
  /** BASE64二维码链接 */
  base64Qrcode: string,
  /** 二维码链接 */
  qrCode: string,
};

/**
 * ### 支付渠道
 * 
 * * code: 支付渠道code
 * * name: 支付渠道名称
 * * payId: 支付id(提交时需要)
 * * paytype: TODO 支付类型(暂未知)
 * * maxAmount: 最大值,-1表示没有限制
 * * minAmount: 最小值，-1表示没有限制
 * * fee: 手续费
 * * amountList: 定额(可用金额列表)
 * * virtualType: 虚拟币类型
 * * webId: TODO 未知字段
 * * protocols: 支付协议列表
 */
export type PaymentChannel = {
  /** 支付渠道code */
  code: string,
  /** 支付渠道名称 */
  name: string,
  /** 支付id(提交时需要) */
  payId: number,
  /** 支付类型(0 银行卡, 1 支付宝, 2 微信) */
  payType: string,
  /** 最大值,-1表示没有限制 */
  maxAmount: number,
  /** 最小值，-1表示没有限制 */
  minAmount: number,
  /** 手续费 */
  fee: number,
  /** 定额(可用金额列表) */
  amountList: Array<string> | undefined,
  /** 虚拟币类型 */
  virtualType: string,
  /** TODO 未知字段 */
  webId: string,
  /** 支付协议列表 */
  protocols: Array<PaymentProtocol>,
};

/**
 *  ### 支付种类
 * 
 * * isFirst: 是否第一次充值 1是 0否
 * * code: 种类code
 * * name: 种类名称
 * * rate: 人民币转虚拟币汇率
 * * cashierModeFlag: 当code为wallet时，前端根据这个字段显示tab，0-表示银联充值 1-表示交易所买币
 * * cpayChannels: 支付渠道列表
 */
export type PaymentGenre = {
  /** 是否第一次充值 1是 0否 */
  isFirst: number,
  /** 种类code */
  code: string,
  /** 种类名称 */
  name: string,
  /** 人民币转虚拟币汇率 */
  rate: number,
  /** 当code为wallet时，前端根据这个字段显示tab，0-表示银联充值 1-表示交易所买币 */
  cashierModeFlag: number,
  /** 支付渠道列表 */
  payChannels: Array<PaymentChannel>,
  /** 状态 -1: 不可用, 0: 正常 */
  status: -1 | 0 | 1,
};

/**
 * 支付相关接口
 */
export default class Payment extends BaseApi {
  constructor () {
    super({ baseURL: AppConfig.AG_USER_URL });
  }

  /**
   * 获取可用支付渠道列表
   * 
   * @returns 可用渠道列表
   */
  channels () : Promise<Array<PaymentGenre>> {
    return this._get('payment/payChannel');
  }

  /**
   * 小金库存款提交
   *
   * @param params 提交参数
   * @returns 提交结果
   */
  dcBox (
    params: {
      payId: string,
      virtualAmount: number,
      rate: number
    }
  ) : Promise<{
    qrCodeBase64: string,
    amount: number,
    qrCodeUrl: string,
    wakeUpUrl: string,
    htmlUrl: string,
    billNo: string
  }> {
    return this._post(
      'payment/dcBox',
      params
    ) as any;
  }

  /**
   * 查询交易所
   * @param transferType 交易类型 0: 买币  1: 卖币
   */
  usdtExchange (transferType: 0|1): Promise<Array<{
    otcMarketName: string,
    otcMarketLink: string
  }>> {
    return this._get(
      'payment/exchange',
      { params: { transferType } }
    );
  }

  /**
   * 转账存款, 对应: /api/pay/bq
   * @param params 请求参数
   */
  bankpay (
    params: {
      /** 汇款人姓名 */
      accountName: string,
      /** 汇款金额 */
      amount: number,
      /** 转账类型 1:银行卡 2:支付宝 3:微信 */
      payType: number
    }
  ) {
    return this._post(
      'payment/bankpay',
      params
    );

    // return Promise.resolve({
    //   "finalDate": "2021-03-25 16:15:07",
    //   "accountNamePinyin": "lĭ lĕi",
    //   "pendingCount": 26,
    //   "grade": "0",
    //   "fiveSucceedRate": 77.78,
    //   "deposit": {
    //     "accountName": "大饭店",
    //     "amount": 500,
    //     "couponId": "",
    //     "payType": "1",
    //     "transferType": ""
    //   },
    //   "collection": {
    //     "accountname": "李磊",
    //     "accountnumber": "6216607600007464019",
    //     "amount": 500,
    //     "bankaddress": "",
    //     "bankcity": "",
    //     "bankcode": "BOC",
    //     "bankname": "中国银行",
    //     "bankprovince": "",
    //     "billno": "210325160006917E",
    //     "postscript": ""
    //   },
    //   "avgSucceedTime": "00:02:45"
    // });
  }

  /** 扫码支付 */
  scanqr (
    params: {
      /** 商户支付id */
      payId: string,
      /**
       * 支付类型
       * * ONLINE_BANK,
       * * QQ_QR,
       * * QQ_APP,
       * * WECHAT_QR,
       * * BIG_WECHAT_QR,
       * * WECHAT_APP,
       * * BIG_WECHAT_APP,
       * * ONLINE_UNIONPAY_QR,
       * * ONLINE_PLATFORM,
       * * IVI_ONLINE_PLATFORM_MOBILE,
       * * ONLINE_JD_QR,
       * * QUICK_PAY,
       * * ALIPAY_QR,
       * * BIG_ALIPAY_QR,
       * * ALIPAY_APP,
       * * BIG_ALIPAY_APP,
       * * BITCOIN,
       * * USDT,
       * * BITCOIN_MOBI,
       * * USDT_MOBI,
       * * PAY_CARD,
       * * USDT_BFB,
       * * USDT_XJK
       */
      payType: string,
      /** 充值金额 */
      amount: number,
      /** 代理费金额 */
      reChargeFeeAmount: number,
      /** 代理费费率 */
      reChargeFeeRate: number,
    }
  ) {
    return this._post(
      'payment/scanqr',
      params,
    );
  }

  /** 获取充值提交的表单数据及地址 */
  orderForm (
    params: {
      payType: string,
      token: string
    }
  ) {
    return this._get(
      'payment/order/form',
      { params }
    )
  }
}