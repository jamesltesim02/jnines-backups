import BaseApi from './base'
import DevConfig from '../config/config.dev'

/**
 * 神单  
 */
export default class GuruApi extends BaseApi {
  /**
   * 查询神单列表  
   *
   * @param {object} params 查询参数
   *    {  
   *      isTop: 是否推荐神单  
   *          参数范围:  
   *          0 (默认)所有神单  
   *          1: 推荐神单  
   *      pageSize: 每页记录数  
   *      pageIndex: 当前页码  
   *    }  
   */
  list (params) {
    return this._get(
      'plan/hotPlan',
      {
        params: {
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }

  /**
   * 查询神单详情  
   *
   * @param {string} ticketId 查询参数  
   */
  getGuru (ticketId) {
    return this._get(
      'plan/hotPlanDetails',
      { params: { ticketId } }
    )
  }

  /**
   * 查询指定神单跟单列表
   * @param {object} params 查询参数
   *    {
   *      ticketId: 神单id
   *      pageSize: 每页记录数
   *      pageIndex: 当前页码
   *    }
   */
  guruFollowList (params) {
    return this._get(
      'plan/hotPlanFollows',
      { params }
    )
  }

  /**
   * 查询大神资料  
   *
   * @param {string} id 大神id  
   */
  getMaster (userId) {
    return this._get(
      'user/hotUserInfo',
      { params: { userId } }
    )
  }

  /**
   * 查询大神方案列表  
   *
   * @param {object} params 查询参数  
   *    {  
   *      userId: 大神id  
   *      pageSize: 每页记录数  
   *      pageIndex: 当前页码  
   *    }  
   */
  getMasterPrograms (params) {
    return this._get(
      'plan/userHotPlan',
      {
        params: {
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }

  /**
   * 发布神单  
   *
   * @param {object} params 发布参数  
   *    {  
   *      ticketId: 将要发布的订单id  
   *      content: 发布宣言  
   *    }  
   */
  publish (params) {
    return this._post(
      'plan/publishPlan',
      params
    )
  }

  /**
   * 跟单  
   *
   * @param {object} params 跟单参数  
   *    {  
   *      betAmount: 跟单金额  
   *      currency: 币种  
   *      ticketId: 跟单id  
   *      qTime: 跟单时间戳  
   *    }  
   */
  doFollow (params) {
    return this._post(
      'plan/followPlan',
      {
        qTime: Date.now(),
        ...params
      }
    )
  }

  /**
   * 查询跟单对应的最大返还额  
   *
   * @param {number} multiNum
   *    串关数, 如果为空则查询所有串关数量对应的最大返还额度  
   * 
   * @returns  
   *    [  
   *      {  
   *        _id: 主键  
   *        num: 串关数量  
   *        compensate: 最大返还额度  
   *      }  
   *    ]  
   */
  getQuota (multiNum) {
    const params = {}
    if (typeof multiNum === 'number') {
      params.num = multiNum
    }

    return this._get(
      'quota/followQuota',
      params
    )
  }
}
