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
export const listPlan = (params) => {
    return axios.post(
      'plan/query',
      {
        ...devConfig.pageParams,
        ...params
      }
    )
}

export const updatePlan = (params) => {
  return axios.post(
    'plan/updatePlan',
     params
  )
}

export const planFollows = (ticketId) => {
  return axios.get(
    'plan/planFollows',
    {
      params: {
        ticketId
      }
    }
  )
}

export const planCount = () => {
  return axios.get('plan/planCount')
}