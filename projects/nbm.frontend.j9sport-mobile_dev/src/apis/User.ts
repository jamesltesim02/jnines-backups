import BaseApi from './BaseApi'

import { Urls } from '../configs'

export default class User extends BaseApi {
  constructor () {
    super({ baseURL: Urls.TEST_SIGN_API_URL });
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