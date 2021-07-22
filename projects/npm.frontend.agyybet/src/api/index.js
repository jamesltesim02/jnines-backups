import React from 'react'
import { Component } from 'react'
import BaseApi from './base'
import PullApi from './pull'
import QuoteApi from './quote'
import BetApi from './bet'
// import FavoriteApi from './favorite'
import SignApi from './sign'

/**
 * ### api 对应映射  
 */
const apiMapping = {
  // 基础api接口, 包含log
  base: BaseApi,
  // 用于查询比赛信息等api接口
  pull: PullApi,
  // // 点水
  quote: QuoteApi,
  // // 投注
  bet: BetApi,
  // // 收藏
  // favorite: FavoriteApi,
  // 登录
  sign: SignApi
}

/**
 * 获取将要注入组件的api列表对象
 *
 * @param {array} apis 将要注入的api对象

 */
const getApis = (apis) => {
  if (!apis || !apis.length) {
    return {}
  }

  const apiObj = {}

  apis.forEach(apiKey => {
    apiObj[apiKey] = new apiMapping[apiKey]().init()
  })

  return apiObj
}

/**
 * ### 注入api对象到组件  
 * 可选api列表:  
 *   base 基础接口调用功能(包含http基本请求以及log)  
 * 
 * @param  {array} apis 将要注入的api列表  
 */
export const withApi = (...apis) => SubComponent => (
  class ApiWrappedComponent extends Component {
    apiProps
    
    /** client render时创建api对象 */
    constructor () {
      super()
      this.apiProps = getApis(apis)
      this.apiProps.cancel = this.cancelApi.bind(this)
    }

    /** 当组件被卸载时取消当前组件正在发起的所有请求 */
    componentWillUnmount () {
      if (!this.apiProps) {
        return
      }

      this.cancelApi()
    }

    cancelApi () {
      apis.forEach(apiKey => {
        this.apiProps[apiKey].cancel()
      })
    }

    /** 注入api对象 */
    render () {
      return (
        <SubComponent
          {...this.props}
          api={this.apiProps}
        />
      )
    }
  }
)

export default withApi