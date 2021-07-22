import BaseApi from './base'
import DevConfig from '../config/config.dev'

/**
 * 榜单类别对应接口名
 */ 
const apiMapping = {
  // 盈利榜
  profit: 'ranking/profitRanking',
  // 命中榜
  hit: 'ranking/betRateRanking',
  // 连红榜
  consecutive: 'ranking/hitRanking',
  // 带红榜
  led: 'ranking/redRanking'
}

/**
 * 排行榜
 */
export default class RankingApi extends BaseApi {
  /**
   * 查询排行榜  
   *
   * @param {object} params 查询参数  
   *    {  
   *      pageSize: 每页记录数  
   *      pageIndex: 当前页码  
   *      timeRange: 时间范围条件  
   *          参数范围:  
   *          week: (默认)周  
   *          month: 月  
   *      type: 排行榜类型  
   *          参数范围:  
   *          profit: (默认)盈利榜,  
   *          hit: 命中榜,  
   *          consecutive: 连红榜,  
   *          led: 带红榜  
   *    }  
   */
  list({
    type = 'profit',
    time = 'week',
    ...params
  }) {
    return this._get(
      apiMapping[type],
      {
        params: {
          timeRange: time,
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }
}
