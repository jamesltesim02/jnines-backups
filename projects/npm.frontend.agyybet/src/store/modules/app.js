import  { types } from 'mobx-state-tree'

import devConfig from '../../config/config.dev'

import { saveToStorage, loadFromStorage } from '../../utils/storage-utils'

const STORAGE_KEY = 'agyy-store-app'

const type = types.model(
  'App',
  {
    /** 当前语言 */
    locale: devConfig.defaultLocale,
    /** 是否是第一次进入页面 */
    firstRoute: types.boolean,
    /** 最后一次访问的路由地址 */
    lastpath: types.string,
    /** 当前访问的路由地址 */
    currpath: types.string,
    /**
     * 接受赔率变化类型  
     * 0 = 不接受赔率变化  
     * 1 = 接受更高赔率   
     * 2 = 接受所有赔率变化  
     */
    oddsAC: types.number,
    /** 默认投注额 */
    defaultAmount: types.maybeNull(types.number),
    /** 新订单数量(此处只统计投注成功订单) */
    newOrder: 0,
    /**
     * 列表玩法显示类型
     * 1: 单玩法
     * 2: 三玩法
     */
    listMarketView: 1,
  }
).actions(self => ({
  /**
   * 设置当前语言值  
   *
   * @param {string} locale 语言值  
   */
  setLocale (locale) {
    self.locale = locale

    saveToStorage(
      STORAGE_KEY,
      {
        oddsAC: self.oddsAC,
        defaultAmount: self.defaultAmount,
        listMarketView: self.listMarketView,
        locale
      }
    )
  },
  /**
   * ### 设置最后一次访问的路由地址  
   *
   * @param {string}} lastpath 新路由地址  
   */
  setCurrpath (currpath = '') {
    if (self.currpath) {
      self.lastpath = self.currpath
      self.firstRoute = false
    }
    self.currpath = currpath
  },
  /**
   * ### 设置用户配置数据  
   *
   * @param {object} param0 设置对应数据  
   *  {  
   *    oddsAC: 接受赔率变化类型  
   *    defaultAmount: 默认投注额  
   *  }  
   */
  setSettings (setting) {

    self.oddsAC = setting.oddsAC
    self.defaultAmount = setting.defaultAmount
    self.listMarketView =  setting.listMarketView

    saveToStorage(
      STORAGE_KEY,
      {
        ...setting,
        locale: self.locale
      }
    )
  },
  /** 设置新订单数量 */
  setNewOrder (orderCount) {
    self.newOrder = orderCount
  },
}))

export default {
  type,
  initial: () => {
    const cache = loadFromStorage(
      STORAGE_KEY,
      {
        locale: devConfig.defaultLocale,
        oddsAC: 1,
        defaultAmount: null,
        listMarketView: 2
      }
    )
    return type.create({
      firstRoute: true,
      lastpath: '',
      currpath: '',
      ...cache
    })
  }
}