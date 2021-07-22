import BaseApi from './BaseApi'

import { Urls } from '../configs/config.local'

export default class User extends BaseApi {
  constructor () {
    super({ baseURL: Urls.PULL });
  }

  /**
   * 登录
   *
   * @param params 登录参数
   */
  login (params: { username: string, password: string }) {
    return this._post(
      'user/login',
      params
    )
  }

}