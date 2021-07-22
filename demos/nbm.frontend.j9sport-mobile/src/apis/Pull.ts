import BaseApi from './BaseApi';
import { Urls } from '../configs';

import { LIST_MARKETS, AVAILABLE_SPORTS, MatchState, Sports } from '../consts/match';

const categories: any = {
  topTours: 'right/getTopLeagueMatch',
  top12: 'right/get12HourMatch',
};

/** pull 接口 */
export default class Pull extends BaseApi {
  constructor() {
    super({ baseURL: Urls.PULL });
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

  /** 查询公告和banner */
  getNoticeAndBanners() {
    return this._get('home/getNoticeAndBanners');
  }

  /** 查询首页焦点比赛 */
  getHomeMatchs(sports: Array<Sports>) {
    return this._post(
      'home/getHomeMatchs',
      { marketTypes: LIST_MARKETS.getMarkets(...sports) }
    )
  }

  /** 查询比赛详情 */
  getMatchDetail(matchId: string) {
    return this._get(
      'match/getMatchDetails',
      { params: { matchId } }
    );
  }

  /**
   *
   * @param params 查询条件
   * ```javascript
   * {
   *   language	String	语言，参考枚举
   *   sportType	Int	体育类型ID，参看枚举
   *   marketTypes	Int[]	玩法数组
   *   matchState	Int	比赛状态，参考枚举 0:早盘 -1:今日 1:滚球 99:串关 100:即将开赛
   *   pageIndex	Int	分页页码从1开赛
   *   tourIds	String[]	联赛数组
   *   dateTime	String	日期或时间范围，早盘：20201111，今日：当前时间戳_接下来的时间
   *   orderBy	int	排序规则 0:按时间 1：按联赛
   * }
   * ```
   */
  getMatchList(
    {
      sportId,
      matchState,
      ...params
    }: any
  ) {
    return this._post(
      'match/getMatchList',
      {
        sportType: sportId,
        matchState,
        marketTypes: LIST_MARKETS.getMarkets(sportId),
        ...params
      }
    );
  }

  /** 查询联赛下的比赛 */
  getTourMatchs(
    {
      sportId,
      ...params
    }: {
      sportId: number,
      tourIds: Array<string>
    }
  ) {
    return this._post(
      'filter/getMatchByTours',
      {
        marketTypes: LIST_MARKETS.getMarkets(sportId),
        pageIndex: 1,
        ...params
      }
    );
  }

  /** 查询体育项建议的推荐比赛 */
  getSuggest(
    { sportId }: { sportId: Sports }
  ) {
    return this._post(
      'sport/getLiveAndSelect',
      {
        sportType: sportId,
        marketTypes: LIST_MARKETS.getMarkets(sportId),
      }
    );
  }

  /**
   * 查询赛果
   *
   * @param {object} params
   * 查询参数:
   * ```javascript
   *  {
   *     sportId: 体育项ID  
   *     matchDay: 比赛日期yyyyMMdd  
   *  }
   * ```
   */
  getMatchResults(
    params: {
      sportId: number,
      matchDay: string
    }
  ) {
    return this._get(
      'result/getMatchResult',
      { params }
    );
  }

  /** 查询直播列表 */
  getLiveList(
    params: {
      sportId: number,
      matchDay?: string
    }
  ) {
    return this._get(
      'result/getLiveAnnounce',
      { params }
    );
  }

  /** 查询按日期统计比赛数量 */
  getDayCounts(
    params: {
      sportId: number,
      matchState: number
    }
  ) {
    return this._get(
      'filter/getDayList',
      { params }
    );
  }

  /** 查询联赛列表 */
  getTours(
    params: {
      sportId: number,
      matchState: number
    }
  ) {
    return this._get(
      'filter/getTourList',
      { params }
    );
  }

  /**
   * ### 查询订单
   *
   * @param {object} params 查询条件
   *  {
   *    ticketState: 是否结算（所有：-1，已结算：1，未结算：0）
   *    pageIndex: 当前页码
   *    startTime: 开始时间
   *    limitTime: 截止时间
   *  }
   */
  getTickets(
    params: {
      ticketState?: number,
      pageIndex?: number,
      startTime?: number,
      limitTime?: number,
      pageSize?: number
    }
  ) {
    return this._get(
      'ticket/queryTickets',
      { params }
    )
  }


  /** 查询用户收藏的比赛列表 */
  getFavIds() {
    return this._get('favorite/getFavObjIds')
  }

  /**
   * ### 添加收藏
   *
   * @param {object} params 相关参数
   *  ```javascript
   *  {
   *    objId: 比赛或联赛id
   *    favType: 收藏类型(1: 比赛 2: 联赛id)
   *  }
   *  ```
   */
  addFavorite(
    params: {
      objId: string,
      favType: number
    }
  ) {
    return this._post(
      'favorite/addFavorite',
      params
    )
  }

  /**
   * ### 取消收藏
   *
   * @param {string} objId 比赛或联赛id
   */
  cancelFavorite(
    { objId }: any
  ) {
    return this._post(
      'favorite/cancelFavorite',
      { objId }
    )
  }

  /**
   * 查询收藏的比赛列表
   * @param {object} params 查询参数
   *  {
   *    marketTypes: 列表需要显示的玩法列表
   *  }
   */
  getFavorites() {
    return this._post(
      'favorite/getFavoriteMatch',
      {
        pageIndex: 1,
        marketTypes: LIST_MARKETS.getMarkets(...AVAILABLE_SPORTS)
      }
    )
  }

  /** 清空收藏的比赛  */
  clearFavorite() {
    return this._get('favorite/cleanFavorite')
  }

  /** 获取用户注单统计数据
   * @param {object} params 查询参数
   * {
   *  dayCount: 查询统计的天数
   * }
   */
  getUserBetStatistics(
    { dayCount }: { dayCount: number }
  ) {
    return this._get(
      'ticket/getUserBetStatistics',
      { params: { dayCount } }
    )
  }

  /**
   * 查询指定体育类型各状态比赛数
   *
   * @param {number} sportId 体育类型
   */
  getCountsOfSport(sportId: number) {
    return this._get(
      'sport/getMatchCount',
      {
        params: { sportType: sportId }
      }
    );
  }
  /** 获取首页各比赛数量 */
  getTotalSportsCount() {
    return this._get('home/getMatchCount');
  }

  /** 获取串关各体育项数量 */
  getComboSportsCount() {
    return this._get('liveCombo/getComboCount');
  }

  /** 获取滚球各体育项数量 */
  getInplaySportsCount() {
    return this._get('liveCombo/getLiveCount');
  }
  /** 查询正在直播的列表 */
  getRecommendLives() {
    return this._get(
      'right/getLiveVideo',
      { params: { pageSize: 5 } }
    );
  }

  /** 查询赛事数量 */
  getCountsBySports(sportType: number) {
    return this._get(
      'right/getForecast',
      { params: { sportType } }
    );
  }

  /** 获取优惠列表 */
  getActivity(params?: any) {
    return this._get(
      'activity/getActivitys',
      { params }
    );
  }

  /** 根据分类查询比赛列表 */
  getMatchsByCategory (
    {
      category,
      sportId,
      pageIndex = 1
    }: {
      category: string,
      sportId: Sports,
      pageIndex: number
    }
  ) {
    return this._post(
      categories[category],
      {
        sportType: sportId,
        marketTypes: LIST_MARKETS.getMarkets(...AVAILABLE_SPORTS),
        pageIndex
      }
    );
  }

  /** 查询即将开赛 */
  getComingSoon (sportId: Sports) {
    return this._get(
      'right/getReommMatch',
      {
        params: {
          sportType: sportId,
          matchState: MatchState.LIVE
        }
      }
    );
  }
  /** 获取公告列表 */
  getNoticeList(pageIndex = 1 ) {
    return this._get(`notice/getNoticeList?pageIndex=${pageIndex}`)
  }
  /** 获取公告详情 */
  getNoticeDetails(id: string) {
    return this._get(`notice/getNoticeDetails?id=${id}`)
  }

  /** 查询注单id */
  getTicketByMatch (matchId: string) {
    return this._get(
      'ticket/getTicketByMatch',
      { params: { matchId } }
    );
  }

  /** 查询提供给主站体育二级页面嵌入的快速投注比赛 */
  getQuickbetMatch () {
    return this._post(
      'match/getTopOneMatch',
      {
        marketTypes: LIST_MARKETS.getMarkets(
          Sports.SOCCER,
          Sports.BASEBALL
        ),
        size: 6
      }
    )
  }
 /** 查询可跳转的比赛ID */
  getBetMatchByUser() {
    return this._get('ticket/getBetMatchByUser')
  }

  /** 查询比赛&联赛 */
  getMatchTours(content: string) {
    return this._get(`filter/queryMatchTours?content=${content}`)
  }

  /** 保存用户配置 */
  saveSettings (params: any) {
    return this._post(
      'userConfig/saveUserConfig',
      params
    );
  }

  /** 查询用户配置 */
  getSettings () {
    return this._get('userConfig/getUserConfig');
  }

  /** 检查注单状态 */
  getCheckTickets (ticketIds: string) {
    return this._get(
      'ticket/checkTickets',
      {params: {ticketIds}}
    )
  }

}
