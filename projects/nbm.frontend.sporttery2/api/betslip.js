import BaseApi from './base'
import DevConfig from '../config/config.dev'

/**
 * 注单列表
 */
export default class BetslipApi extends BaseApi {

  /**
   * 查询竞彩注单列表  
   *
   * @param {object} params 查询参数  
   *    {  
   *      type: 注单类型  
   *          参数范围:  
   *            竞彩注单  
   *            0: (默认) 进行中/未结算  
   *            1: 中奖  
   *            2: 未中奖  
   *            3: 自购  
   *            4: 跟单  
   *            现场注单
   *            0: (默认) 未结算
   *            1: 已结算
   *      liveType: 彩种类别
   *          参数范围:
   *          0: (默认) 竞彩注单
   *          1: 现场注单
   *      pageSize: 每页记录数  
   *      pageIndex: 当前页码  
   *      startTime: 开始时间  
   *      endTime: 结束时间  
   *    }
   */
  list (params) {
    return this._get(
      'plan/findBetList',
      {
        params: {
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }
}
