import BaseApi from './base'

/** v2的pull接口, 主要用于红包活动 */
export default class PromoApi extends BaseApi {
  constructor () {
    super({ baseURL: window.__AGYY_SPORTS_CONFIG__.V2_PULL_URL })
  }
  /** 抢红包 */
  getRedEnvLopes (actId, compUserId,userId) {
    return this._get(
      'activity/getRedEnvelopes',
      { params: { actId, compUserId } }
    )
  }

  /** 检查是否可以开始飘红包 */
  getCheckRedAct (actId, compUserId) {
    return this._get(
      'activity/checkRedAct',
      { params: { actId, compUserId } }
    )
  }

  /** 查询用户红包记录 */
  getMyRedEnvelopes (params) {
    return this._get(
      'activity/getRedRecord',
      { params }
    );
  }

  /** 查询有红包活动的比赛预告列表 */
  getRedEnvelopeMatchs (params) {
    return this._get(
      'activity/getRedAdvance',
      { params }
    );
  } 

  /** 查询优惠详情 */
  getDetail (params) {
    return this._get(
      'activity/getActivityDetails',
      { params }
    );
  }
}