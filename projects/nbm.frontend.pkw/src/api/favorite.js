import BaseApi from './base'
import { PULL_URL } from '../config/config.ops'

/**
 * 收藏相关api
 */
export default class FavoriteApi extends BaseApi {
  constructor() {
    super({ baseURL: PULL_URL })
  }

  /**
   * 添加到收藏
   *
   * @param {string} matchId 比赛id
   */
  add (matchId) {
    return this._post(
      'favorite/addFavorite',
      { matchId }
    )
  }

  /**
   * 取消收藏
   *
   * @param {string} matchId 比赛id
   */
  delete (matchId) {
    return this._post(
      'favorite/cancelFavorite',
      { matchId }
    )
  }

  /**
   * 查询收藏列表
   *
   * @param {object} params 查询条件
   *  {
   *    marketType: 玩法类型条件
   *    pageIndex: 页码
   *  }
   */
  list (params) {
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
      'favorite/getFavoriteMatch',
      params
    )
  }
  /**
   * 查询用户收藏的id列表
   */
  getIds () {
    return this._get('favorite/getFavMatchIds')
  }
}
