import BaseApi from './base'

/**
 * 新闻
 */
export default class MemberApi extends BaseApi {
  
  /**
   * 查询用户信息
   */
  getMemberInfo (params = {}) {
    return this._get('user/userInfo', { params })
  }

  /**
   * 更新用户信息
   *
   * @param {object} params 需要更新的用户信息
   *    {
   *      nickName: 昵称
   *      header: 头像
   *      sex: 性别
   *    }
   */
  updateInfo (params) {
    return this._post('user/updateUser', params)
  }
}