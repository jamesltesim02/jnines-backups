import BaseApi from "./BaseApi";
import AppConfig from '../configs';

export default class Oddin extends BaseApi {
  constructor() {
    super({
      baseURL: AppConfig.THIRD_URL
    });
  }

  /**
   * 充值记录
   * @param params
   */
  getRechargeRecord(
    params: { limitTime: Object; pageIndex: number; pageSize: number; startTime: Object; userName: any; status?: number | string }
  ) {
    return this._get(
      'query/queryRechargeRecord',
      {params}
    )
  }

  /**
   * 优惠记录
   * @param params
   */
  getDiscountRecord(
    params: {
      userName: string
      status: 1 | 0 | -1
      startTime?: number
      limitTime?: number
      pageIndex: number
      pageSize: number
    }
  ) {
    return this._get(
      'query/queryDiscountRecord',
      {params}
    )
  }

  /**
   * 交易记录
   * @param params
   */
  getTransRecord(
    params: {
      userName: string
      transType?: number
      startTime?: number
      limitTime?: number
      mainSportTransType?: number | '' //1:用户从体育手动发起 2:用户提现发起 3:主站发起
      pageIndex: number
      pageSize: number
    }
  ) {
    return this._get(
      'query/queryTransRecord',
      {params}
    )
  }

  /**
   * 提款记录
   * @param params
   */
  getWithdrawRecord (
    params: {
      userName: string
      transType?: number
      startTime?: number
      limitTime?: number
      pageIndex: number
      pageSize: number
    }
  ) {
    return this._get(
      '/query/queryWithdrawRecord',
      {params}
    )
  }

  /**
   * 获取其他游戏的注单
   * @param params
   */
  getTickets(
    params: {
      ticketStatus: number | string
      startTime: number
      endTime: number
      pageIndex: number
      pageSize: number
      userName: string
      appId: number
    }
  ) {
    return this._get(
      '/ticketApi/getOrderListByApp',
      {
        params
      }
    )
  }

}