import BaseApi from './base'

/**
 * 点水服务api
 */
export default class BetApi extends BaseApi {
  constructor() {
    super ({ baseURL: window.__AGYY_SPORTS_CONFIG__.BET_URL })
  }

  /**
   * ### 投注操作  
   *
   * @param {object} params 投注参数  
   *  {
   *    accept: 是否接受赔率变化  0: 不接受, 1: 接受更好赔率, 2: 接受所有赔率  
   *    betItems: [ 投注内容  
   *      {
   *        betType: 投注类型 1: 单式, 2: 串关  
   *        bets: [  
   *          {
   *            betM: 串关的投注项数, 如果betM为3,betN为4, 则表示本注单为3串4  
   *            betN: 串关的串数, 如果betM为3,betN为4, 则表示本注单为3串4  
   *            betCount: 注数  
   *            betAmount: 投注金额  
   *          }
   *        ]  
   *        options: [  
   *          {
   *            optionId: 投注项ID  
   *            odds: 赔率  
   *          }
   *        ]  
   *      }  
   *    ]  
   *  }  
   */
  doBet (params) {
    return this._post('bet/doBet', params)
  }

  /**
   * 根据用户token查询用户相关信息
   * @param {string} token 用户token
   */
  getBalance (token) {
    return this._get(
      'bet/getBalance',
      {
        params: { token }
      }
    )
  }
}
