import createAxios from './index'
import devConfig from '../config/config.dev'

const axios = createAxios()

/**
 * 登录
 * @param {object} params 登录参数
 *    {
 *      userName: 账号
 *      passWord: 密码
 *    }
 */
export const login = params => axios.post('user/login', params)

/**
 * 查询当前用户的权限菜单列表
 */
export const getMenus = () => axios.get('user/getNavBar')

export const listUser = (params) => {
  return axios.get(
    'user/listUser',
    {
      params: {
        ...devConfig.pageParams,
        ...params
      }
    }
  )
}

export const setTags = (params) => {
  return axios.post(
    'user/setTags',
    params
  )
}

