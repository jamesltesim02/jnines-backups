import createAxios from './index'
import devConfig from '../config/config.dev'

const axios = createAxios()

/**
 * 查询用户列表
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listAdminUser = (params) => {
  return axios.get(
    'admin/getAdminList',
    {
      params: {
        ...devConfig.pageParams,
        ...params
      }
    }
  )
}

/**
   * 删除用户
   * @param {string} id 主键
   */
export const deleteAdminUser = (id) => {
  return axios.get(
    'admin/delAdmin',
    {
      params: {
        id
      }
    }
  )
}

/**
 * 新增用户
 * @param {Object} params 
 * {
 *    
 * }
 */
export const addAdminUser = (params) => {
  return axios.post(
    'admin/addAdminUser',
    params
  )
}

/**
 * 修改用户属性
 * @param {*} params 
 */
export const updateAdminUser = (params) => {
  return axios.post(
    'admin/updateAdmin',
    params
  )
}

/**
 * 设置用户角色
 * @param {*} params 
 */
export const setAdminRole = (params) => {
  return axios.post(
    'admin/setAdminRole',
    params
  )
}



/**
 * 查询角色列表
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listRole = (params) => {
  return axios.get(
    'admin/getAdminList',
    {
      params: {
        ...devConfig.pageParams,
        ...params
      }
    }
  )
}

export const getAllRoles=()=>{
  return axios.get('admin/getAllRoles')
}
