import BaseApi from './base'

/**
 * 可用查询方法
 */
const listMethods = {
  focus: 'fans/myFocus',
  fans: 'fans/myFans'
}

/**
 * 关注
 */
export default class FansApi extends BaseApi {

  /**
   * 添加关注
   *
   * @param {object} params 请求参数
   *    {
   *      userId: 当前用户id
   *      focusUserId: 被关注的用户ID
   *    }
   */
  focus (params) {
    return this._post(
      'fans/focus',
      params
    )
  }

  /**
   * 取消关注
   * @param {object} params 请求参数
   *    {
   *      userId: 当前用户id
   *      focusUserId: 被取消关注的用户ID
   *    }
   */
  unfocus (params) {
    return this._post(
      'fans/cancel',
      params
    )
  }

  /**
   * 查询关注列表
   *
   * @param {string} userId 被查询的用户id
   */
  list (type = 'focus', userId) {
    return this._get(
      listMethods[type],
      {
        params: { userId }
      }
    )
  }
}