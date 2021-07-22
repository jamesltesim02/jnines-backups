import BaseApi from './BaseApi';
import {Urls} from '../configs';

export default class Quote extends BaseApi {
  constructor() {
    super({ baseURL: Urls.QUOTE_URL });
  }

  /**
   * 点水服务
   *
   * @param {object} options 需要点水的option列表
   *  {
   *    options: [
   *      {
   *        optionId: 投注项id
   *      }
   *    ]
   *  }
   * TODO 需要针对data进行单独处理, 提取出extra
   */
  doQuote (options: any) {
    return this._post(
      'quote/multiQuote',
      { options }
    )
  }
  /**
   * 串关点水
   *
   * @param {object} options 需要点水的option列表
   */
  comboQuote (options: any) {
    return this._post(
      'quote/comboQuote',
      { options },
      {
        /**
         * ### 单独处理串关点水返回结果
         *
         * @param {string} data 接口响应内容
         */
        transformResponse(data: any) {
          const result = data ? JSON.parse(data) : {}
          if (result.code !== 200) {
            return result
          }

          return {
            ...result,
            data: {
              options: result.data,
              extras: result.extras
            }
          }
        }
      }
    )
  }
}
