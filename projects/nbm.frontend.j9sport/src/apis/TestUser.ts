import BaseApi from './BaseApi';
import AppConfig from '../configs';

export default class TestUser extends BaseApi {
  constructor () {
    super({ baseURL: AppConfig.SIGN_URL });
  }

  /**
   * 登录
   *
   * @param params 登录参数
   */
  login (
    {
      username,
      password
    }: {
      username: string,
      password: string
    }
  ) {
    return this._post(
      'sport/login',
      {
        account: username,
        password
      }
    )
  }

}