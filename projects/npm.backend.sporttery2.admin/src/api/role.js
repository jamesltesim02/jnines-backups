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
export const listRole = (params) => {
  return axios.get(
    'role/getRoleList',
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
export const deleteRole = (id) => {
  return axios.get(
    'role/delRole',
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
export const addRole = (params) => {
  return axios.post(
    'role/addRole',
    params
  )
}

/**
 * 修改用户属性
 * @param {*} params 
 */
export const updateRole = (params) => {
  return axios.post(
    'role/updateRole',
    params
  )
}

export const getAllResource=()=>{
  return axios.get('role/getAllResource')
}

/**
 * 设置角色资源权限
 * @param {*} params 
 */
export const setRoleResource = (roleId, sourceIds) => {
  return axios.post(
    'role/setRoleResource',
    {roleId, sourceIds}
  )
}

