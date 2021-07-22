import React from 'react'

import { AG8_URL } from '../../config/config.ops'
import { ag8 } from '../../config/config.dev'

import { isServer } from '../../utils/env-utils'
// import { initializeStore } from '../../store'

/**
 * 转到亚游地址
 *
 * @param {string} path 需要转到的地址  
 * @param {object} params 跳转参数,*只能作为get参数传递  
 */
export const toAg8 = (path = '', params = {}) => {
  if (isServer()) {
    return
  }

  const { location } = window

  // 如果params中没有设置from参数,则自动添加当前url为from
  if (!params.from) {
    params.from = encodeURIComponent(location.href.replace(/\?.*/, ''))
  }

  // 判断是否登录,如果已登录则添加token参数
  // const store = initializeStore()
  // if (store && store.member.isLoged) {
    // params.token = store.member.token
  // }

  // 将paran参数转为字符串
  const paramStr = Object.entries(params).map(entry => {
    const [key, value] = entry
    if (Array.isArray(value)) {
      return value.map(ev => `${key}=${ev}`).join('&')
    }
    return `${key}=${value}`
  }).join('&')

  const {
    protocol,
    host
  } = location

  // TODO 切换回主站时需要换回自动获取地址
  // const agHost = `${protocol}//${host}/user/`
  const agHost = 'http://uath88h5.agg013.com/user/'

  // 拼接并转到对应地址
  window.location = `${agHost}${path}${paramStr ? `?${paramStr}` : ''}`
}

/**
 * 转到登录页面
 */
export const toSignin = () => toAg8(ag8.signin)

/**
 * 针对亚游的link组件
 * @param {object} param 组件参数
 *    {
 *      href: 要转到的地址
 *      params: 跳转参数
 *    }
 */
export default function Ag8Link ({
  href,
  params = {},
  children
}) {
  return React.cloneElement(
    children,
    { onClick: () => toAg8(href, params) }
  )
}
