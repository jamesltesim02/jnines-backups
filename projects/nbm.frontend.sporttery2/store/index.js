import { types, applySnapshot } from 'mobx-state-tree'
import { isServer } from '../utils/env-utils'

import App from './modules/app'
import Toast from './modules/toast'
import Member from './modules/member'
import Matchs from './modules/matchs'
import Cart from './modules/cart'

import Qxc from './modules/qxc'

const Store = types.model({
  // app相关信息
  app: App.type,
  // 提示及loading
  toast: Toast.type,
  // 用户信息
  member: Member.type,
  // 比赛相关
  matchs: Matchs.type,
  // 购物车
  cart: Cart.type,
  // 数字彩
  qxc: Qxc.type
})

const stores = {}

export const initializeStore = (ctx = null, snapshot = null) => {
  const requestId = ((ctx || {}).req || {}).requestId

  if (!stores[requestId]) {
    stores[requestId] = Store.create({
      app: App.initial(),
      toast: Toast.initial(),
      member: Member.initial(),
      matchs: Matchs.initial(),
      cart: Cart.initial(),
      qxc: Qxc.initial(),
    })

    if (isServer() && ctx && ctx.req) {
      ctx.req.on('end', () => {
        delete stores[requestId]
      })
    }
  }

  if (snapshot) {
    applySnapshot(stores[requestId], snapshot)
  }

  return stores[requestId]
}

export default initializeStore
