
import Axios from 'axios'

import OpsConfig from '../config/config.ops'
import devConfig from '../config/config.dev'

import { initializeStore } from '../store'

/**
 * api处理基类
 */
class BaseApi {

  axios = null
  store = null
  config = null

  cancelSource = Axios.CancelToken.source()

  constructor (config) {
    this.config = config
  }

  init () {
    // 创建axios对象
    const axios = this.axios = Axios.create({
      baseURL: OpsConfig.API_URL,
      ...this.config
    })

    // 获取store对象
    this.store = initializeStore()

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
   * 请求公共参数设置  
   *
   * @param {object} conf 当前已有配置
   */
  handleRequest (conf) {
    const {
      app: { locale },
      member: {
        isLoged,
        memberInfo
      }
    } = this.store

    // 请求语言
    conf.headers['Accept-Language'] = locale

    // 如果是get请求,参数在params中,其余在data中
    const paramKey = conf.method === 'get' ? 'params' : 'data'
    // 构造新请求参数, 添加clientType,language与frontId
    const reqData = {
      clientType: OpsConfig.CLIENT_TYPE,
      language: locale,
      frontId: OpsConfig.FRONT_ID,
      ...(conf[paramKey] || {})
    }

    // 如果已登录则添加用户相关参数
    if (isLoged) {
      conf.headers.Authorization = memberInfo.token
      reqData.token = memberInfo.token
      reqData.userId = memberInfo.userId
    }

    conf[paramKey] = reqData

    // 撤销请求的依据
    conf.cancelToken = this.cancelSource.token

    return conf
  }

  handleRequestError (err) {
    console.warn('reqeust error:', err)
    return Promise.reject(err)
  }

  /**
   * 网络连接异常
   * @param {object}} err 
   */
  handleResponseError (err) {
    // 如果是因为cancel发生的错误,则不作任何提示
    if (Axios.isCancel(err)) {
      return Promise.reject()
      // return Promise.resolve({
      //   code: -1,
      //   msg: '取消接口请求'
      // })
    }

    this.store.toast.optionsToast(
      'message.neterror',
      {
        variant: 'error',
        intl: true
      }
    )
    return Promise.reject(err)
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
      }
    } = devConfig

    console.log('handle result error:', error)

    // 需要登登录, 提示信息并转到登录页面
    if (unauthorized === error.code) {
      // 转到登录页面
      // TODO  提示APP转到登录
      return null
    }

    // 错误处理方式为提示错误信息
    if (messageErrorCode.includes(error.code)) {
      this.store.toast.optionsToast(
        `errorCode.${error.code}`,
        {
          variant: 'error',
          intl: true
        }
      )
      // TODO 202 400 401 402 10003 10004 记录日志
      // return Promise.reject(error)
    }

    // 地域限制
    if (error.code === locationRestricted) {
      // TODO 转到403页面
      // return Promise.reject(error)
    }

    // 服务器维护中
    if (error.code === systemMaintenance) {
      // TODO 转到503页面
      // return Promise.reject(error)
    }

    return Promise.reject(error)
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
    return this.handleResultError(data)
  }

  /**
   * 记录日志
   *
   * @param {object} content 日志信息
   */
  log (content) {
    console.log('====error=======:', content)
  }

  cancel () {
    this.cancelSource.cancel()
  }
}

// 统一添加http相关几个方法
['_get', '_post', '_put', '_delete'].forEach(method => {
  BaseApi.prototype[method] = function (...args) {
    return this.axios[method.substring(1)](...args)
  }
})

export default BaseApi