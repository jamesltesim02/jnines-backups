import  { types } from 'mobx-state-tree'

import devConfig from '../../config/config.dev'

import { saveToStorage, loadFromStorage, clearStorage } from '../../utils/storage-utils'
import getFlexibleMode, { MODE_SIZE } from '../../utils/get-flexible-mode'

const STORAGE_KEY = 'agyy-store-app'

const caheAppStore = ({
  version,
  origin,
  clientType,
  locale,
  oddsAC,
  defaultAmount,
  listMarketView
}) => {
  saveToStorage(
    STORAGE_KEY,
    {
      version,
      origin,
      clientType,
      locale,
      oddsAC,
      defaultAmount,
      listMarketView
    }
  )
}

const type = types.model(
  'App',
  {
    initSearch: '',
    /** 缓存版本号 */
    version: types.number,
    /** 来源站点域名, 用于跳转登陆及存取款的地址 */
    origin: types.string,
    /** 客户端类型 */
    clientType: types.number,
    /** 页面来源类型 1: 正常接入, 2: 二级页面,快速投注 */
    originType: 1,
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
    /**
     * 列表玩法显示类型
     * 1: 单玩法
     * 2: 三玩法
     */
    listMarketView: 2,
    /** 当前窗口宽度 */
    docWidth: types.number,
    /** 是否为PC模式 */
    pcMode: false,
    /** 是否只显示纯页面,不显示 */
    purePage: false,
    /** 是否显示联赛过滤按钮 */
    tourFilterable: false,
  }
).views(
  self => ({
    /** 自适应尺寸类型值 */
    flexMode: () => getFlexibleMode(self.docWidth),
  })
).actions(self => ({
  // TODO 函数名需要修改
  initAppStore ({
    origin,
    clientType,
    locale
  }) {
    self.origin = origin || self.origin
    self.clientType = clientType || self.clientType
    self.locale = locale || self.locale
    caheAppStore({ ...self })
  },
  /**
   * 设置内容窗口宽度
   * @param {number} width 内容窗口宽度
   */
  setDocWidth (width) {
    self.docWidth = width
    self.pcMode = width >= MODE_SIZE.medium.min
  },
  setOriginType (type) {
    self.originType = type
  },
  setInitSearch (initSearch) {
    self.initSearch = initSearch
  },
  /**
   * 设置当前语言值  
   *
   * @param {string} locale 语言值  
   */
  setLocale (locale) {
    // self.locale = locale
    caheAppStore({
      ...self,
      locale
    })
    if (window.top === window) {
      window.location.reload()
    } else {
      const {
        protocol,
        host,
        pathname,
        search
      } = window.location

      const initParam = new URLSearchParams(self.initSearch)
      if (search && search.length > 0) {
        const currentParam = new URLSearchParams(search)
        for (const [key, value] of currentParam) {
          initParam.set(key, value)
        }
      }
      initParam.set('locale', locale)
      window.location = `${protocol}//${host}${pathname}?${initParam.toString()}`
    }
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

    caheAppStore({ ...self })
  },
  setPurePage (purePage = false) {
    self.purePage = purePage
    window.document.body.classList[
      purePage ? 'add' : 'remove'
    ]('pure')
  },
  setTourFilterable(show) {
    self.tourFilterable = show
  }
}))

export default {
  type,
  initial: () => {
    const conf = window.__AGYY_SPORTS_CONFIG__
    let cache = loadFromStorage(STORAGE_KEY)
    if (
      !cache
      ||
      conf.STORAGE_VERSION !== cache.version
    ) {
      clearStorage()
      cache = {
        version: conf.STORAGE_VERSION,
        origin: conf.DEFAULT_ORIGIN,
        clientType: conf.CLIENT_TYPE,
        locale: devConfig.defaultLocale,
        oddsAC: devConfig.defaultAC,
        listMarketView: devConfig.defaultListMarketView,
        defaultAmount: null,
      }
      caheAppStore(cache)
    }

    const docWidth = document.documentElement.clientWidth
    return type.create({
      ...cache,
      firstRoute: true,
      lastpath: '',
      currpath: '',
      docWidth,
      pcMode: docWidth >= MODE_SIZE.medium.min
    })
  }
}