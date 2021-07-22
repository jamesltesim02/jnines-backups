import axios from 'axios'
import NBConstant from '@/assets/js/base'
import {
  loadFromStorage
} from '@/utils/StorageUtils'

import {callUnLogin} from '@/utils/ClientAdapter'

// 默认接口为 app_pull
const baseURL = window.NBServer.p_s1

/**
 * 获取当前的语言
 */
const getLanguage = () => {
  return loadFromStorage(
    NBConstant.platform_settings,
    {}
  ).nb_language || NBConstant.plate_config.nb_language
}

// POST请求格式为json
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

// 请求拦截器,设置baseurl以及默认的语言参数
axios.interceptors.request.use(
  config => {
    if (!config) {
      return config
    }

    // 自动判断以及补全base url
    if (!config.baseURL) {
      config.baseURL = baseURL
    }

    if(config.method.toLowerCase() == 'post') {
      // POST 自动加lang
      config.data = {
        lang: getLanguage(),
        ...config.data
      }
    }else {
      // GET 自动添加lang参数
      config.params = {
        lang: getLanguage(),
        ...config.params
      }
    }

    // 设置默认超时时间
    if (!config.timeout) {
      config.timeout = NBConstant.NB_MOBILE_API_TIMEOUT
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  ({data}) => {
    if (data.result === 200) {
      return data.data
    }
    return Promise.reject(data)
  },
  error => {
    console.warn(error)
    
    // 正常错误
    if(typeof error.result === 'number') {
      // 如果是未登录,调用客户端未登录事件
      if(e.result === 105) {
        callUnLogin()
        return;
      }

      return Promise.reject(error)
    }

    // 网络超时
    if(error.code === 'ECONNABORTED') {
      return Promise.reject({result: 99999})
    }
    
    // 其他错误
    return Promise.reject({result: 199})
  }
)
