import BaseApi from './base'
import { SIGN_URL } from '../config/config.ops'

/** 登录相关api */
export default class SignApi extends BaseApi {
  constructor() {
    super({ baseURL: SIGN_URL })
  }
  /**
   * ### 登录操作  
   *
   * @param {string} username 账号
   * @param {string} password 密码
   */
  login (username, password) {
    return this._post(
      'sport/login',
      {
        account: username,
        password
      }
    )
  }
}