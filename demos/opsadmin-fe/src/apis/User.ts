import BaseApi from './BaseApi'

import { Urls } from '../configs/config'

export default class User extends BaseApi {
  constructor () {
    super({ baseURL: Urls.API });
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

  /** 退出登录 */
  logout () {
    return this._post('user/logout');
  }

  /** 修改密码 */
  updatePwd (params: any) {
    return this._post('user/updatePwd', params);
  }
}