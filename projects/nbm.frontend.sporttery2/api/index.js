import { Component } from 'react'
import { isServer } from '../utils/env-utils'
import BaseApi from './base'
import InfoAPi from './info'
import Ranking from './ranking'
import BetslipApi from './betslip'
import GuruApi from './guru'
import MemberApi from './member'
import FansApi from './fans'
import ShopApi from './shop'
import PullApi from './pull'
import QuoteApi from './quote'
import BetApi from './bet'
import QxcApi from './qxc'

// api 对应映射
const apiMapping = {
  base: BaseApi,
  info: InfoAPi,
  ranking: Ranking,
  betslip: BetslipApi,
  guru: GuruApi,
  member: MemberApi,
  fans: FansApi,
  shop: ShopApi,
  pull: PullApi,
  quote: QuoteApi,
  bet: BetApi,
  qxc: QxcApi,
}

/**
 * 获取将要注入组件的api列表对象
 * @param {array} apis 将要注入的api对象
 * @param {object} store  store对象
 */
const getApis = (apis, ctx) => {
  if (!apis || !apis.length) {
    return {}
  }

  const apiObj = {}

  apis.forEach(apiKey => {
    const api = new apiMapping[apiKey]().init(ctx)
    apiObj[apiKey] = api
  })

  return apiObj
}

/**
 * 注入api对象到组件
 * 
 * @param  {array} apis 将要注入的api列表  
 *
 *    可选api列表:  
 *      base 基础接口调用功能(包含http基本请求以及log)  
 *      announcement 公告  
 *      banner 大图  
 *      news 新闻  
 *      ranking 榜单  
 *      betslip 注单  
 *      member 用户信息  
 *      fans 关注相关   
 *      shop 积分商品相关  
 *      pull 比赛查询  
 *      quote 点水  
 *      bet 投注  
 *      qxc 数字彩  
 */
export const withApi = (...apis) => SubComponent => (
  class ApiWrappedComponent extends Component {
    apiProps

    /**
     * server render时的api对象注入
     * @param {object} ctx 上下文对象
     */
    static async getInitialProps(ctx) {
      let pageProps = {}

      const apiProps = getApis(apis, ctx)
      if (SubComponent.getInitialProps) {
        pageProps = await SubComponent.getInitialProps({
          ...ctx,
          api: apiProps
        })
      }

      return pageProps
    }

    /**
     * client render时创建api对象
     */
    constructor () {
      super()
      if (!isServer()) {
        this.apiProps = getApis(apis)
      }
    }

    /**
     * 注入api对象
     */
    render () {
      return (
        <SubComponent
          {...this.props}
          api={this.apiProps || {}}
        />
      )
    }
  }
)

export default withApi