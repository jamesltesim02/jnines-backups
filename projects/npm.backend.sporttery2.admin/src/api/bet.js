import createAxios from './index'
import devConfig from '../config/config.dev'

const axios = createAxios()

/**
 * 查询注单列表
 *
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listBet = (params) => {
    return axios.post(
      'bet/query',
      {
        ...devConfig.pageParams,
        ...params
      }
    )
}
