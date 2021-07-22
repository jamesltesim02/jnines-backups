import BaseApi from './base'
import DevConfig from '../config/config.dev'

/**
 * ## 积分商城  
 */
export default class BetslipApi extends BaseApi {

  /**
   * ### 查询商品列表
   */
  listProducts () {
    return this._get('ware/findList')
  }

  /**
   * ### 查询商品详情  
   *
   * @param {string} id 商品id  
   */
  getProduct (id) {
    return this._get(
      '/ware/findWareById',
      {
        params: { id }
      }
    )
  }

  /**
   * ### 积分兑换商品  
   *
   * @param {object} params 兑换参数  
   *  {  
   *    wareId: 商品id  
   *    wareNum: 兑换数量  
   *    size: 尺寸
   *    color: 颜色
   *    addressId: 地址id
   *  }  
   */
  redeem (params) {
    return this._post('ware/cashPrize', params)
  }

  /**
   * ### 查询兑换记录  
   */
  redeemHistory (params) {
    return this._get(
      'ware/cashPrizeLog',
      {
        params: {
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }

  /**
   * ### 获取收货地址  
   */
  getAddress () {
    return this._get(
      'ware/getAddress',
      {
        transformResponse(data) {
          const result = data ? JSON.parse(data) : {}
          if (result.code === 404) {
            result.code = 200
            result.data = null
          }
          return result
        }
      }
    )
  }

  /**
   * ### 保存收货地址  
   *
   * @param {object} params 地址内容参数  
   */
  saveAddress (params) {
    return this._post(
      'ware/address',
      params
    )
  }
}
