import BaseApi from './BaseApi';
import AppConfig from '../configs';

export default class Third extends BaseApi {
  constructor() {
    super({ baseURL: AppConfig.THIRD_URL });
  }
  /**
   * 获取SABA登录Token
   * @param userId
   * @param currency
   */
  _shaba_doLoginRegister(
    {
      userName,
      currency
    }: {
      userName: string
      currency: number
    }
  ) {
    return this._post(
      'seamless/doLoginRegist',
      {
        userName,
        currency
      }
    )
  }
}