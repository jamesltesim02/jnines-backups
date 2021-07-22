import BaseApi from './base'
import DevConfig from '../config/config.dev'

/**
 * Banner
 */
export default class InfoApi extends BaseApi {
  /**
   * 查询Banner列表
   */
  listBanner () {
    return this._get('info/findBannerList')
  }

  /**
   * 查询新闻列表
   *
   * @param {object} params 查询参数
   *    {
   *      pageSize: 每页记录数
   *      pageIndex: 当前页码
   *    }
   */
  listNews (params) {
    return this._get(
      'info/findHotNewsList',
      {
        params: {
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }

  /**
   * 查询新闻详情
   *
   * @param {string} id 新闻id
   */
  getNews (id) {
    return this._get(
      'info/findHotNewsById',
      { params: { id } }
    )
  }

  /**
   * 查询公告列表
   *
   * @param {object} params 查询参数
   *    {
   *      pageSize: 每页记录数
   *      pageIndex: 当前页码
   *    }
   */
  listAnnos (params) {
    return this._get(
      'info/findNoticeList',
      {
        params: {
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }

  /**
   * 查询公告详情
   *
   * @param {string} id 主键
   * @param {string} userId 当前用户id, 如果登陆需要传入,用于设置已读
   */
  getAnno (id, userId) {
    return this._get(
      'info/findNoticeById',
      {
        params: {
          id,
          userId
        }
      }
    )
  }

  /**
   * 查询优惠详情内容
   *
   * @param {string} id 优惠详情id
   */
  getPromodesc (id) {
    return this._get(
      'explain/findExplainById',
      {
        params: { id }
      }
    )
  }

  /**
   * 查询推荐直播
   */
  getHotLive (params) {
    return this._get(
      'liveTop/getLiveTopList',
      {
        params: {
          ...DevConfig.pageParams,
          ...params
        }
      }
    )
  }
}
