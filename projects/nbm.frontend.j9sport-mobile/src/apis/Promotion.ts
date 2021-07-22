import BaseApi from './BaseApi';
import AppConfig from '../configs';

/** pull 接口 */
export default class Promotion extends BaseApi {
  constructor() {
    super({baseURL: AppConfig.PULL});
  }

  /** 查询用户红包记录 */
  getMyRedEnvelopes(params?: any) {
    return this._get(
      'activity/getRedRecord',
      {params}
    );
  }

  /** 检查是否可以开始飘红包 */
  getCheckRedAct(actId: string, compUserId: string) {
    return this._get(
      'activity/checkRedAct',
      {params: {actId, compUserId}}
    )
  }

  /** 抢红包 */
  getRedEnvLopes(actId: string, compUserId: string) {
    return this._get(
      'activity/getRedEnvelopes',
      {params: {actId, compUserId}}
    )
  }

  /** 查询有红包活动的比赛预告列表 */
  getRedEnvelopeMatchs(params?: any) {
    return this._get(
      'activity/getRedAdvance',
      {params}
    );
  }

  /** 查询优惠详情 */
  getDetail (params: { slideId: string }) {
    return this._get(
      'activity/getActivityDetails',
      { params }
    );
  }
}
