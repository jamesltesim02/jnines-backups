import createAxios from './index'
import devConfig from '../config/config.dev'

const axios = createAxios()

/**
 * 查询公告列表
 *
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listNotice = (params) => {
  return axios.get(
    'notice/getNoticeList',
    {
      params: {
        ...devConfig.pageParams,
        ...params
      }
    }
  )
}

/**
   * 查询公告详情
   *
   * @param {string} id 主键
   * @param {string} userId 当前用户id, 如果登陆需要传入,用于设置已读
   */
export const deleteNotice = (id) => {
  return axios.get(
    'notice/delNotice',
    {
      params: {
        id
      }
    }
  )
}

/**
 * 新增公告
 * @param {Object} params 
 * {
 *    
 * }
 */
export const addNotice = (params) => {
  return axios.post(
    'notice/addNotice',
    params
  )
}

export const updateNotice = (params) => {
  return axios.post(
    'notice/updateNotice',
    params
  )
}
