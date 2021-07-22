import { types, applySnapshot } from 'mobx-state-tree'

import App from './modules/app'
import Toast from './modules/toast'
import Member from './modules/member'

import Matchs from './modules/matchs'
import Cart from './modules/cart'
import Favorite from './modules/favorite'


const Store = types.model({
  app: App.type,
  toast: Toast.type,
  member: Member.type,
  matchs: Matchs.type,
  cart: Cart.type,
  favorite: Favorite.type,
})

let store = null

export const initializeStore = (snapshot = null) => {

  if (!store) {
    store = Store.create({
      app: App.initial(),
      toast: Toast.initial(),
      member: Member.initial(),
      matchs: Matchs.initial(),
      cart: Cart.initial(),
      favorite: Favorite.initial(),
    })
  }

  if (snapshot) {
    applySnapshot(store, snapshot)
  }

  return store
}

export default initializeStore
