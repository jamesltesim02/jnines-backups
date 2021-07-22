import BaseApi from './base'
import { listMarkets } from '../config/config.dev'

/** 
 * 列表查询时需要查询的玩法类型列表  
 *  
 *  1: 足球胜平负  
 *  186: 篮球胜负  
 *  16: 让分  
 *  18: 大小  
 */
const LIST_MARKETS = listMarkets.map(m => m.market).flat()

/** 分类查询比赛对应的接口名 */
const CATEGORY_METHODS = {
  // 近12小时
  last12h: 'sporthome/get12HourMatch',
  // 即将开赛
  soon: 'sporthome/getSoonMatch',
  // 指定区域
  area: 'sporthome/getCategoryMatch',
  // 顶级联赛
  toptour: 'sporthome/getTopLeagueMatch',
  // 电竞
  esports: 'sporthome/getMatchByESport'
}

/** 查询相关api */
export default class PullApi extends BaseApi {
  constructor () {
    super({ baseURL: window.__AGYY_SPORTS_CONFIG__.PULL_URL })
  }

  /** 查询焦点赛事, 即将开赛, 优惠活动 */
  getFocusAndAds (userId = 0) {
    return this._post(
      'home/getFocusAndAds',
      {
        userId,
        marketTypes: LIST_MARKETS
      }
    )
  }

  /**
   * 查询滚球列表及精选比赛 
   *
   * @param {number} sportType 体育类型, 参数为空时查询大首页对应数据
   */
  getInplayAndFeatured (sportType) {
    if (sportType) {
      return this._post(
        'sporthome/getLiveAndSelect',
        {
          marketTypes: LIST_MARKETS,
          sportType
        }
      )
    }
    return this._post(
      'home/getLiveAndSelect',
      {
        marketTypes: LIST_MARKETS
      }
    )
  }

  /**
   * 根据条件查询比赛列表
   *
   * @param {object} params 查询参数
   *  {
   *    sportType: 体育类型
   *    matchState: 比赛状态
   *    pageIndex: 查询页码
   *    tourIds: 联赛id数组
   *  } 
   */
  getMatchList (params) {
    return this._post(
      (
        params.matchState === 99
        ? 'match/getComboMatch'
        : 'match/getMatchList'
      ),
      {
        ...params,
        marketTypes: LIST_MARKETS
      }
    )
  }

  /**
   * 查询联赛列表
   *
   * @param {object} params 查询条件
   *  {
   *    sportId: 体育类型
   *    matchState: 比赛状态
   *  }
   */
  getTourList (params) {
    return this._get(
      'match/getTourList',
      { params }
    )
  }

  /**
   * 查询比赛详情
   *
   * @param {string} matchId 比赛id
   */
  getMatchDetail(matchId) {
    return this._get(
      'match/getMatchDetails',
      {
        params: { matchId }
      }
    )
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
   * 查询比分
   *
   * @param {object} params 查询参数  
   *  {
   *    sportId: 体育项ID
  *     matchDay: 比赛日期yyyyMMdd
   *  }
   */
  getMatchResults (params) {
    return this._get(
      'match/getMatchResult',
      { params }
    )
  }

  /**
   * 查询近期开赛以及区域比赛统计  
   *
   * @param {number} sportType 体育类型  
   */
  getAdvancesAndAreas (sportType) {
    return this._get(
      'sporthome/getMatchForecastAndCategory',
      {
        params: { sportType }
      }
    )
  }

  /**
   * 插队执行分类比赛列表  
   *
   * @param {string} category 查询类型  
   * @param {object} params 查询参数  
   *  {
   *    sportType 体育项ID
   *    pageIndex 分页页码
   *  }
   */
  getCategory (category, params) {
    return this._post(
      CATEGORY_METHODS[category],
      {
        ...params,
        marketTypes: LIST_MARKETS
      }
    )
  }

  /** 查询用户收藏的比赛列表 */
  getFavIds () {
    return this._get('favorite/getFavObjIds')
  }

  /**
   * 添加收藏
   *
   * @param {object} params 相关参数
   *  {
   *    objId: 比赛获联赛id
   *    favType: 收藏类型(1: 比赛 2: 联赛id)
   *  }
   */
  addFavorite (params) {
    return this._post(
      'favorite/addFavorite',
      params
    )
  }

  /**
   * 取消收藏
   * 
   * @param {object} params 相关参数
   *  {
   *    objId: 比赛获联赛id
   *  }
   */
  cancelFavorite (params) {
    return this._post(
      'favorite/cancelFavorite',
      params
    )
  }

  /**
   * 查询收藏的比赛列表
   * @param {object} params 查询参数
   *  {
   *    pageIndex: 页码
   *  }
   */
  getFavorites (params) {
    return this._post(
      'favorite/getFavoriteMatch',
      {
        ...params,
        marketTypes: LIST_MARKETS
      }
    )
  }

  /**
   * 清空收藏的比赛
   */
  clearFavorite () {
    return this._get('favorite/cleanFavorite')
  }

  /** 查询各体育比赛数和公告 */
  getCountsAndAnnou () {
    return this._get('home/getCountAndNotice')
  }

  /**
   * 查询公告详情
   *
   * @param {string} noticeId 公告id
   */
  getAnnouDetail (noticeId) {
    return this._get(
      'home/getNoticeDetails',
      {
        params: { noticeId }
      }
    )
  }

  /**
   * 查询指定体育类型各状态比赛数
   *
   * @param {number} sportType 体育类型
   */
  getCountsOfSport (sportType) {
    return this._get(
      'sporthome/getMatchCount',
      {
        params: { sportType }
      }
    )
  }

  /**
   * 查询直播预告  
   *  
   * @param {object} params 查询参数  
   *  {  
   *    sportId: 体育项ID 可为空  
   *    matchDay: 比赛日期yyyyMMdd  
   *  }  
   */
  getLiveAnnounce (params) {
    return this._get(
      'match/getLiveAnnounce',
      { params }
    )
  }

  /**
   * 查询即将开赛的比赛列表
   *
   * @param {object} params 查询参数
   */
  getSoonList (params) {
    return this._post(
      'sporthome/getSoonMatch',
      {
        ...params,
        marketTypes: LIST_MARKETS
      }
    )
  }

  /**
   * 查询比赛对应的注单列表
   *
   * @param {string} mid 比赛id
   */
  getMatchTickets (mid) {
    return this._get(
      'ticket/getTicketByMatch',
      {
        params: { matchId: mid }
      }
    )
  }

  /**
   * 查询联赛下的比赛列表  
   *
   * @param {object} params 查询条件  
   *  {
   *    sportType: 体育类型  
   *    categoryId: 联赛id  
   *  }
   */
  getTourMatchs (params) {
    return this._post(
      'match/getAppLeagueMatch',
      {
        ...params,
        marketTypes: LIST_MARKETS
      }
    )
  }

  /**
   * 查询提供给主站体育二级页面嵌入的快速投注比赛  
   *
   * @param {number} sportType 体育类型  
   */
  getQuickbetMatch () {
    return this._post(
      'sporthome/getTopOneMatch',
      { marketTypes: LIST_MARKETS }
    )
  }

  /**
   * 获取当前系统状态  
   * 
   * *** API由运维中后端nginx中实现,不是真正由pull服务实现  
   * 
   * @return
   *  {  
   *    forbibiden: boolean 是否地域限制  
   *    maintenance: boolean 是否系统维护中  
   *  }  
   */
  getSystemState () {
    return this._get('live')
  }


  /**
   *  查询天下第一的榜单  
   *
   * @param {object} params 查询参数  
   *  {  
   *    actId:	活动ID  
   *    startTime:	活动开始时间  
   *    limitTime: 活动截止时间  
   *    pageSize: 记录条数  
   *  }  
   */
  async getTop1Leaderboard (params) {
    return Promise.all([
      // 盈利榜
      this._get('ticket/getProfitList', { params }),
      // 胜率榜
      this._get('ticket/getWinRateList', { params }),
      // 负盈利榜
      this._get('ticket/getNegativeProfitList', { params })
    ])
  }

  /**
   * 查询体验活动剩余名额
   *
   * @param {object} params 查询条件
   *  {
   *    actId: 活动id
   *  }
   */
  getExpericenceLimit (params) {
    return this._get(
      'activity/getLeftNumber',
      { params }
    )
  }

  /**获取各体育项滚球数量*/
  getAppLiveMatchCount() {
    return this._get( 'match/getAppLiveMatchCount')
  }
}
