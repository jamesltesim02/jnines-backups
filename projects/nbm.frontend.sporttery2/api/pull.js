import BaseApi from './base'
import OpsConfig from '../config/config.ops'

/**
 * 比赛相关api  
 */
export default class PullApi extends BaseApi {
  constructor () {
    super({ baseURL: OpsConfig.PULL_URL })
  }


  /**
   * ### 查询比赛数量统计  
   *
   * @param {object} params 查询条件  
   *  {  
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *    matchState: 比赛状态
   *    tourIds: 联赛id列表
   *  }  
   */
  getMatchCount (params) {
    return this._post(
      'match/getMatchCount',
      params
    )
  }

  /**
   * ### 查询比赛列表
   *
   * @param {object} params 查询参数  
   *  {  
   *    sportType: 体育id  
   *    marketTypes: 玩法数组  
   *    matchState: 比赛状态  
   *    tourIds: 联赛id列表
   *    pageIndex: 页码  
   *  }  
   */
  getMatchList (params) {
    return this._post(
      'match/getMatchList',
      params
    )
  }

  /**
   * 查询联赛列表  
   *
   * @param {object} params 查询条件  
   *  {
   *    sportId: 体育项id
   *    matchState: 比赛状态
   *  }
   */
  getTourList (params) {
    return this._get(
      'tour/getTourList',
      { params }
    )
  }

  /**
   * 查询单场比赛
   *
   * @param {string} id 比赛id
   */
  getMatchDetail (id) {
    return this._get(
      'match/getMatchDetails',
      { params: { matchId: id } }
    )
  }

  /**
   * 查询直播列表
   */
  getLiveList (params) {
    return this._get(
      'match/getMatchLive',
      { params }
    )
  }

  /**
   * 查询赛果
   *
   * @param {number} sportId 体育类型id
   * @param {string} time 查询时间
   */
  list(sportId, time) {
    return this._get(
      'match/findMacthScoreOther',
      {
        params: {
          lang: 1,
          matchDay: time,
          sportIds: sportId
        }
      }
    )
  }
}
