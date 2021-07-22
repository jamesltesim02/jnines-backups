import  { types } from 'mobx-state-tree'

import devConfig from '../../config/config.dev'

const type = types.model(
  'App',
  {
    locale: types.string,
    firstRoute: types.boolean,
    lastpath: types.string,
    tabin: types.boolean
  }
).actions(self => ({
  setLocale (locale) {
    self.locale = locale
  },
  setLastpath (lastpath = '') {
    self.lastpath = lastpath
    self.firstRoute = false
  },
  setTabin (isIn) {
    self.tabin = isIn
  }
}))

export default {
  type,
  initial: () => type.create({
    locale: devConfig.defaultLocale,
    firstRoute: true,
    lastpath: '',
    tabin: false
  })
}