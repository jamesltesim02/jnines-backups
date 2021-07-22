import createAxios from './index'
import devConfig from '../config/config.dev'

const axios = createAxios()

/**
 * 查询商品列表
 *
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listWare = (params) => {
  return axios.get(
    'ware/getWareList',
    {
      params: {
        ...devConfig.pageParams,
        ...params
      }
    }
  )
}

export const delWare = (id) => {
  return axios.get(
    'ware/delWare',
    {
      params: {
        id
      }
    }
  )
}

/**
 * 新增商品
 * @param {Object} params 
 * {
 *    
 * }
 */
export const addWare = (params) => {
  return axios.post(
    'ware/addWare', params
  )
}

export const updateWare = (params) => {
  return axios.post(
    'ware/updateWare',
    params
  )
}

export const updateInventory = (params) => {
  return axios.post(
    'ware/updateInventory',
    params
  )
}
