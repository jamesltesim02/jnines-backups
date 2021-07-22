import axios from 'axios'
import {getLanguage} from '@/utils/LanguageUtils'

import matchs from './matchs'

let baseURL = window.NBConfig.URL_API

// 请求拦截器,设置baseurl以及默认的语言参数
axios.interceptors.request.use(
  config => {
    if (!config) {
      return config
    }

    let dataKey = {
      'post': 'data',
      'get': 'params'
    }[config.method]

    if (dataKey) {
      config[dataKey] = {
        lang: getLanguage(),
        ...config[dataKey]
      }
    }

    if (!config.baseURL) {
      config.baseURL = baseURL
    }

    return config
  },
  error => Promise.reject(error)
)

// 添加响应拦截器
axios.interceptors.response.use(
  ({data}) => {
    if (data.result === 200) {
      return data.data
    }
    return Promise.reject(data)
  },
  error => Promise.reject(error)
)

export default {
  matchs
}
