import BaseApi from './base'
import { PULL_URL } from '../config/config.ops'

/**
 * 查询相关api
 */
export default class PullApi extends BaseApi {
  constructor() {
    super({ baseURL: PULL_URL })
  }

  /**
   * 查询比赛列表
   * @param {object} params 查询条件
   */
  listMatchs(params) {
    return this._get(
      'match/findHomePage',
      { params }
    )
  }

  /**
   * 查询精选赛事
   */
  getFeatured () {
    return this._get('match/getTopOneMatch')
  }

  /**
   * ### 查询首页推荐的比赛和滚球
   *
   * @param {object} params 查询参数
   *  {
   *    marketTypes: 玩法数组
   *  }
   */
  getHotMatch (params) {
    /*
     * 如果玩法选择的为0, 则表示全场独赢
     * 需要重新设置为[1, 186]
     * 足球独赢为1(胜平负)
     * 篮球独赢为186(胜负)
     */
    if (params.marketTypes[0] === 0) {
      params.marketTypes = [1, 186]
    }

    return this._post(
      'match/getHotMatch',
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
   *    pageIndex: 页码  
   *  }  
   */
  getMatchList (params) {
    /*
     * 如果玩法选择的为0, 则表示全场独赢
     * 需要重新设置为[1, 186]
     * 足球独赢为1(胜平负)
     * 篮球独赢为186(胜负)
     */
    if (params.marketTypes[0] === 0) {
      params.marketTypes = [1, 186]
    }

    return this._post(
      'match/getMatchList',
      params
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
   * ### 体育首页查询 赛事数量及推荐比赛列表  
   *
   * @param {object} params 查询参数  
   *  {  
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *    marketTypes: 玩法数组  
   *  }  
   */
  getSportHome (params) {
    /*
     * 如果玩法选择的为0, 则表示全场独赢
     * 需要重新设置为[1, 186]
     * 足球独赢为1(胜平负)
     * 篮球独赢为186(胜负)
     */
    if (params.marketTypes[0] === 0) {
      params.marketTypes = [1, 186]
    }

    return this._post(
      'sportmatch/getSportHome',
      params
    )
  }

  /**
   * ### 查询区域信息, 顶级联赛, 最近12小时比赛数量  
   *  
   * @param {object} params 查询参数  
   *  {
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *  }
   */
  getCategory (params) {
    return this._post(
      'sportmatch/getCategory',
      params
    )
  }

  /**
   * ### 查询比赛数量统计  
   *
   * @param {object} params 查询条件  
   *  {  
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *  }  
   */
  getMatchCount (params) {
    return this._get('sportmatch/getMatchCount', { params })
  }

  /**
   * ### 查询订单  
   *
   * @param {object} params 查询条件
   *  {
   *    isSettle: 是否结算
   *    pageIndex: 当前页码
   *    startTime: 开始时间
   *    limitTime: 截止时间
   *  }
   */
  queryTickets (params) {
    return this._get(
      'ticket/queryTickets',
      { params }
    )
  }

  /**
   * ### 查询近12小时比赛  
   *
   * @param {object} params 查询条件  
   *  {  
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *    marketTypes: 玩法数组  
   *    pageIndex: 当前页码  
   *  }  
   */
  getMatchsOf12Hours (params) {
    /*
     * 如果玩法选择的为0, 则表示全场独赢
     * 需要重新设置为[1, 186]
     * 足球独赢为1(胜平负)
     * 篮球独赢为186(胜负)
     */
    if (params.marketTypes[0] === 0) {
      params.marketTypes = [1, 186]
    }
    return this._post(
      'sportmatch/get12HourMatch',
      params
    )
  }

  /**
   * ### 查询顶级联赛赛事预告  
   *
   * @param {object} params 查询条件  
   *  {  
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *    marketTypes: 玩法数组  
   *    pageIndex: 当前页码  
   *  }  
   */
  getMatchsOfTopLeague (params) {
    /*
     * 如果玩法选择的为0, 则表示全场独赢
     * 需要重新设置为[1, 186]
     * 足球独赢为1(胜平负)
     * 篮球独赢为186(胜负)
     */
    if (params.marketTypes[0] === 0) {
      params.marketTypes = [1, 186]
    }
    return this._post(
      'sportmatch/getTopLeagueMatch',
      params
    )
  }

  /**
   * ### 查询特定区域下的比赛列表   
   *
   * @param {object} params 查询条件  
   *  {  
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *    marketTypes: 玩法数组  
   *    categoryId: 区域id
   *  }  
   */
  getMatchsOfCategory (params) {
    /*
     * 如果玩法选择的为0, 则表示全场独赢
     * 需要重新设置为[1, 186]
     * 足球独赢为1(胜平负)
     * 篮球独赢为186(胜负)
     */
    if (params.marketTypes[0] === 0) {
      params.marketTypes = [1, 186]
    }
    return this._post(
      'sportmatch/getCategoryMatch',
      params
    )
  }

  /**
   * 查询串关比赛列表  
   *
   * @param {object} params 查询条件  
   *  {
   *    sportType: 体育类型, 10 足球, 11 篮球, 99 电竞  
   *    marketTypes: 玩法数组  
   *    pageIndex: 当前页码
   *  }
   */
  getComboMatchs (params) {
    /*
     * 如果玩法选择的为0, 则表示全场独赢
     * 需要重新设置为[1, 186]
     * 足球独赢为1(胜平负)
     * 篮球独赢为186(胜负)
     */
    if (params.marketTypes[0] === 0) {
      params.marketTypes = [1, 186]
    }
    return this._post(
      'combo/getComboMatch',
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
   * 查询赛果
   *
   * @param {object} params 查询条件
   *  {
   *    sportId: 体育项ID
  *     matchDay: 比赛日期yyyyMMdd
   *  }
   */
  getMatchRetuls (params) {
    return this._get(
      'match/getMatchResult',
      { params }
    )
  }
}
