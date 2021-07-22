
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
export const listResource = (params) => {
  return axios.get(
    'resource/getResourceList',
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
export const deleteResource = (id) => {
  return axios.get(
    'resource/delResource',
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
export const addResource = (params) => {
  return axios.post(
    'resource/addResource',
    params
  )
}

/**
 * 修改资源属性
 * @param {*} params 
 */
export const updateResource = (params) => {
  return axios.post(
    'resource/updateResource',
    params
  )
}

/**
 * 获取所有根节点
 */
export const getAllRoot=()=>{
  return axios.get('resource/getAllRoot')
}
