// import Axios from 'axios';
import createAxios from './index'
import DevConfig from '../config/config.dev'
// import opsConf from '@/config/config.ops'

const axios = createAxios();

// const axios = Axios.create({
//   baseURL: opsConf.API_URL
// })

/**
 * 查询Banner列表
 */
export const listBanner = () => {
  return axios.get('info/findBannerList')
}

/**
 * 查询新闻列表
 *
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listNews = (params = {}) => {
  console.log('list news')
  return axios.get(
    'info/findHotNewsList',
    {
      params: {
        ...DevConfig.pageParams,
        ...params
      }
    }
  )
}

/**
 * 查询新闻详情
 *
 * @param {string} id 新闻id
 */
export const getNews = (id) => {
  return axios.get(
    'info/findHotNewsById',
    { params: { id } }
  )
}

/**
 * 查询公告列表
 *
 * @param {object} params 查询参数
 *    {
 *      pageSize: 每页记录数
 *      pageIndex: 当前页码
 *    }
 */
export const listAnnos = (params) => {
  return axios.get(
    'info/findNoticeList',
    {
      params: {
        ...DevConfig.pageParams,
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
export const getAnno = (id, userId) => {
  return axios.get(
    'info/findNoticeById',
    {
      params: {
        id,
        userId
      }
    }
  )
}
