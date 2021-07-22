import { types, applySnapshot } from 'mobx-state-tree'

import App from './modules/app'
import Toast from './modules/toast'
import Member from './modules/member'
import Featured from './modules/featured'
import Match from './modules/match/'

const Store = types.model({
  app: App.type,
  toast: Toast.type,
  member: Member.type,
  featured: Featured.type,
  match: Match.type
})

let store = null

export const initializeStore = (snapshot = null) => {

  if (!store) {
    store = Store.create({
      app: App.initial(),
      toast: Toast.initial(),
      member: Member.initial(),
      featured: Featured.initial(),
      match: Match.initial(),
    })
  }

  if (snapshot) {
    applySnapshot(store, snapshot)
  }

  return store
}

export default initializeStore
