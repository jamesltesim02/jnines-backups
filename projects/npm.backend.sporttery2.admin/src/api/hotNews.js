
import createAxios from './index'
import devConfig from '../config/config.dev'

const axios = createAxios()

/**
 * 查询资源列表
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listHotNews = (params) => {
  return axios.get(
    'hotNews/getHotNewsList',
    {
      params: {
        ...devConfig.pageParams,
        ...params
      }
    }
  )
}

/**
   * 删除资源
   * @param {string} id 主键
   */
export const deleteHotNews = (id) => {
  return axios.get(
    'hotNews/delHotNews',
    {
      params: {
        id
      }
    }
  )
}

/**
 * 新增资源
 * @param {Object} params 
 * {
 *    
 * }
 */
export const addHotNews = (params) => {
  return axios.post(
    'hotNews/addHotNews',
    params
  )
}

/**
 * 修改资源属性
 * @param {*} params 
 */
export const updateHotNews = (params) => {
  return axios.post(
    'hotNews/updateHotNews',
    params
  )
}

