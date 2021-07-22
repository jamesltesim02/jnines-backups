import  { types } from 'mobx-state-tree'

import OpsConfig from '../../config/config.ops'
import devConfig from '../../config/config.dev'

import { saveToStorage, loadFromStorage } from '../../utils/storage-utils'

const STORAGE_KEY = 'pkw-store-app'
const FRONTID_KEY = 'pkw-store-front-id'
const IS_NATIVE_KEY = 'pkw-store-is-native-key'

const type = types.model(
  'App',
  {
    /** 当前语言 */
    locale: types.string,
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
    /** 新收藏数量 */
    newFav: 0,
    /** 是否来自原生app */
    isNative: false,
    /** 商户id */
    frontId: types.maybeNull(types.string)
  }
).actions(self => ({
  /**
   * 设置当前语言值  
   *
   * @param {string} locale 语言值  
   */
  setLocale (locale) {
    self.locale = locale
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
    const { oddsAC, defaultAmount, locale } = setting

    self.oddsAC = oddsAC
    self.defaultAmount = defaultAmount
    self.locale = locale

    saveToStorage(STORAGE_KEY, setting)
  },
  /** 设置新订单数量 */
  setNewOrder (orderCount) {
    self.newOrder = orderCount
  },
  /** 设置新收藏数量 */
  setNewFav (favCount) {
    self.newFav = favCount
  }
}))

export default {
  type,
  initial: () => {
    const params = new URLSearchParams(window.location.search)
    const isNativeStr = params.get('isNative')
    let isNative = false

    if (typeof isNativeStr === 'undefined') {
      isNative = loadFromStorage(IS_NATIVE_KEY, false)
    } else {
      isNative = isNativeStr === '1'
      saveToStorage(IS_NATIVE_KEY, isNative)
    }

    let title = params.get('title');
    if (title) {
      title = decodeURIComponent(title);
      const titleEl = document.querySelector('head title');
      titleEl.innerHTML = title;
    }

    let frontId = params.get('frontId');
    if (!frontId) {
      frontId = loadFromStorage(
        FRONTID_KEY,
        OpsConfig.FRONT_ID
      );
    } else {
      saveToStorage(FRONTID_KEY, frontId);
    }

    const cache = loadFromStorage(
      STORAGE_KEY,
      {
        locale: devConfig.defaultLocale,
        // 默认接受所有赔率变化
        oddsAC: 2,
        defaultAmount: null
      }
    )
    return type.create({
      firstRoute: true,
      lastpath: '',
      currpath: '',
      isNative,
      ...cache,
      frontId,
    })
  }
}
