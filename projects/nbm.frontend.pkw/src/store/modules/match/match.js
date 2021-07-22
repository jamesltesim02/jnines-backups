import { types, isAlive } from 'mobx-state-tree'

import AllMatch from './all'
import SportPage from './sport-page'
import Favorite from './favorite'
import Detail from './detail'
import Cart from './cart'
import Category from './category'

const mapping = {
  /** 全部(首页) */
  all: AllMatch,
  /** 足球 */
  10: SportPage,
  /** 篮球 */
  11: SportPage,
  /** 电竞 */
  99: SportPage,
  /** 收藏夹 */
  favorite: Favorite,
  /** 比赛详情 */
  detail: Detail,
  /** 购物车 */
  cart: Cart,
  /** 特定类别页面, 区域联赛, 近12小时, 顶级联赛 */
  category: Category
}

const subTypes = (() => {
  const tempTypes = {}
  Object.entries(mapping).forEach(([k, v]) => {
    tempTypes[k] = types.maybeNull(v.type)
  })
  return tempTypes
})()

/** 所有比赛相关信息store */
const type = types.model(
  'Match',
  {
    /** 当前类型 */
    current: types.maybeNull(types.frozen()),
    ...subTypes
  }
).views(self => ({
  /** 推送上行数据 */
  get pushData () {
    const data = self[self.current] || {}
    return {
      matchs: data.pushData || [],
      options: self.cart.pushData
    }
  }
})).actions(self => ({
  /**
   * 设置当前类型
   *
   * @param {string} current 新类型
   */
  setCurrent (current) {
    self.current = current
  },
  /**
   * 设置当前关注的玩法类别
   *
   * @param {string} market 玩法类别
   */
  setCurrentMarket (market) {
    self[self.current].setCurrentMarket(market)
  },
  /**
   * 设置当前类型对应的数据
   *
   * @param {object} data 数据
   */
  setCurrentData (data) {
    if (!self.current) {
      return
    }
    self[self.current].setData(data)
  },
  /**
   * 添加比赛列表
   * @param {array} matchs 比赛列表
   */
  addMatchsToCurrent (matchs) {
    if (self.current === 'detail') {
      return
    }
    self[self.current].addMatchs(matchs)
  },
  /**
   * 设置购物车数据
   * @param {object} data 购物车数据
   */
  setCartData (data) {
    self.cart = Cart.initial(data)
  },
  /**
   * 往购物车中添加option
   *
   * @param {object} option option信息
   * @param {object} market option所属的玩法信息
   * @param {object} match option所属的比赛信息
   */
  addOptionToCart (option, market, match) {
    // 如果是单式并且已经有选中, 则删除以前选中的option
    if (self.cartModel === 0 && self.cart.size > 0) {
      self.cart.clear()
    }
    self.cart.add(option, market, match)
  },
  /**
   * 从购物车中删除option
   * 
   * @param {string} oid 被删除的option id
   */
  deleteOptionFromCart (oid) {
    self.cart.delete(oid)
  },
  /** 清空购物车 */
  clearCart () {
    self.cart.clear()
  },
  /** 推送消息 */
  onDataChange(event) {
    if(!isAlive(self)) {
      return
    }
    const currentEntity = self[self.current]
    if (currentEntity && currentEntity.onDataChange) {
      currentEntity.onDataChange(event)
    }
    self.cart.onDataChange(event)
  }
}))

export default {
  type,
  initial: () => type.create({
    current: null,
    cartOn: false,
    all: AllMatch.initial(),
    10: SportPage.initial(),
    11: SportPage.initial(),
    99: SportPage.initial(),
    favorite: Favorite.initial(),
    detail: Detail.initial(),
    cart: Cart.initial(),
    category: Category.initial()
  })
}
