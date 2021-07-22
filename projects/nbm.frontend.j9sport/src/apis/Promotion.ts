import BaseApi from './BaseApi';
import AppConfig from '../configs';

/** pull 接口 */
export default class Promotion extends BaseApi {
  constructor() {
    super({ baseURL: AppConfig.PULL });
  }

  /** 查询用户红包记录 */
  getMyRedEnvelopes (params?: any) {
    return this._get(
      'activity/getRedRecord',
      { params }
    );
  }

  /** 查询有红包活动的比赛预告列表 */
  getRedEnvelopeMatchs (params?: any) {
    return this._get(
      'activity/getRedAdvance',
      { params }
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
