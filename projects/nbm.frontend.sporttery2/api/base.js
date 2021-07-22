// TODO 需要在页面被卸载时做cancel
import Axios, { CancelTokenSource, CancelToken } from 'axios'

import OpsConfig from '../config/config.ops'
import devConfig from '../config/config.dev'

import { isServer } from '../utils/env-utils'
import { initializeStore } from '../store'

import { toSignin } from '../components/common/ag8-link'

/**
 * api处理基类
 */
class BaseApi{

  axios = null
  store = null
  config = null

  constructor (config) {
    this.config = config
  }

  init (ctx) {
    // 创建axios对象
    const axios = this.axios = Axios.create({
      baseURL: OpsConfig.API_URL,
      ...this.config
    })

    // 获取store对象
    this.store = initializeStore(isServer() ? ctx : null)

    // 设置axios请求头
    axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'

    // 请求拦截处理
    axios.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    )
    // 响应拦截处理
    axios.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    )

    return this
  }

  /**
   * 请求之前统一设置语言和token
   *
   * @param {object} conf 
   */
  handleRequest (conf) {
    const {
      app: { locale },
      member: {
        isLoged,
        token,
        betId
      }
    } = this.store
    // conf.headers['Accept-Language'] = locale
    conf.headers['Accept-Language'] = 'zh'

    // 如果是get请求,参数在params中,其余在data中
    const paramKey = conf.method === 'get' ? 'params' : 'data'
    // 构造新请求参数, 添加clientType,language与frontId
    const reqData = {
      clientType: OpsConfig.CLIENT_TYPE,
      // language: locale,
      language: 'zh',
      frontId: OpsConfig.FRONT_ID,
      ...(conf[paramKey] || {})
    }

    // 如果已登录则添加用户相关参数
    if (isLoged) {
      conf.headers.Authorization = token
      reqData.token = token
      if (betId && !reqData.userId) {
        reqData.userId = betId
      }
    }

    conf[paramKey] = reqData

    return conf
  }

  handleRequestError (err) {
    console.log('handle request error')
    return Promise.reject(err)
  }

  /**
   * 处理响应结果
   *
   * @param {object}} result 接口处理结果
   */
  handleResponse ({ data = { code: 10003 } }) {
    // 正常结果直接返回data
    if (data.code === 200) {
      return data.data
    }
    // 否则针对特定的code进行处理
    return this.handleResultError(data)
  }

  /**
   * 响应数据为异常
   */
  handleResultError (error) {
    const {
      messageErrorCode,
      bussinessCode: {
        locationRestricted,
        systemMaintenance,
        unauthorized
      },
    } = devConfig

    // 需要登登录, 提示信息并转到登录页面
    if (unauthorized === error.code) {
      // 转到登录页面
      toSignin()
      return null
    }

    // 错误处理方式为提示错误信息
    if (messageErrorCode.includes(error.code)) {
      this.store.toast.optionsToast(
        `common.errorCode.${error.code}`,
        {
          variant: 'error',
          intl: true
        }
      )
      // TODO 202 400 401 402 10003 10004 记录日志
      // return Promise.reject(error)
    }

    // 地域限制
    if (locationRestricted === error.code) {
      // TODO 转到403页面
      // return Promise.reject(error)
    }

    // 服务器维护中
    if (systemMaintenance === error.code) {
      // TODO 转到503页面
      // return Promise.reject(error)
    }


    return Promise.reject(error)
  }

  /**
   * 网络连接异常
   * @param {object}} err 
   */
  handleResponseError (err) {
    this.store.toast.optionsToast(
      `common.message.neterror`,
      {
        variant: 'error',
        intl: true
      }
    )
    return Promise.reject(err)
  }

  /**
   * 记录日志
   *
   * @param {object} content 日志信息
   */
  log (content) {
    console.log('====error=======:', content)
    // TODO 需要获取当前站地址作为log上报接口地址
    // console.log('log......', Router)
    // const {} = window.location
    // this.store.toast.error('content')
    // this._post(
    //   '/logs',
    //   content ,
    //   {
    //     baseURL: ``
    //   }
    // )
  }
}

// 统一添加http相关几个方法
['_get', '_post', '_put', '_delete'].forEach(method => {
  BaseApi.prototype[method] = function (...args) {
    return this.axios[method.substring(1)](...args)
  }
})

export default BaseApi