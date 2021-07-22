import { types, isAlive } from 'mobx-state-tree'

import { listMarkets, availableSports } from '../../config/config.dev'

import MatchList from './match-modeuls/match-list'
import MatchItem from './match-modeuls/match-item'

const KEYS = [
  // 焦点比赛
  'focus',
  // 即将开赛
  'soon',
  // 滚球
  'inplay',
  // 精选赛事
  'featured',
  // 普通比赛列表
  'normal'
]

/** 
 * 列表查询时需要查询的玩法类型列表  
 *  
 *  1: 足球胜平负  
 *  186: 篮球胜负  
 *  16: 让分  
 *  18: 大小  
 */
const LIST_MARKETS = listMarkets.map(m => m.market).flat()

/**
 * 首页store
 */
const type = types.model(
  'Matchs',
  {
    // 当前页面对应的体育类型
    sportId: types.maybeNull(types.number),
    // 循环生成home页面对应数据项
    // 包含数据项: focus, soon, inplay, featured
    ...Object.fromEntries(
      KEYS.map(key => [key, types.maybeNull(MatchList.type)])
    ),
    detail: types.maybeNull(MatchItem.type),
  }
).views(self => ({
  get pushData() {
    if (self.detail) {
      return [{
        sportId: self.detail.sportId,
        marketStage: -1,
        marketType: [-1],
        matchIds: [self.detail.matchId]
      }]
    }

    const mlist = KEYS.map(key => self[key].list).flat()

    return availableSports.map(sport => {
      const slist = mlist.filter(({ sportId }) => sportId === sport)
      if (!slist.length) {
        return []
      }

      return [{
        sportId: sport,
        marketStage: 0,
        marketType: LIST_MARKETS,
        matchIds: slist.map(({ matchId }) => matchId)
      }]
    }).flat()
  }
})).actions(self => ({
  init () {
    KEYS.forEach(key => {
      self[key] = MatchList.initial()
    })
  },
  /** 添加比赛到对应的列表 */
  addData (data) {
    // 根据key遍历获取对应数据项并添加到对应列表上
    KEYS.forEach(key => {
      if (
        data.hasOwnProperty(key)
        &&
        data[key]
        &&
        data[key].length
      ) {
        self[key].addBatch(data[key])
      }
    })
  },
  /** 设置页面相关数据 */
  setData(data) {
    if (data.sportId) {
      self.sportId = data.sportId
    }
    self.addData(data)
  },
  setDetail (match) {
    if (match) {
      self.detail = MatchItem.initial(match)
    }
  },
  /** 清空所有数据 */
  clear (key) {
    if (key) {
      self[key].clear()
      return
    }
    KEYS.forEach(key => {
      self[key].clear()
    })
    self.sportId = null
    self.detail = null
  },
  /**
   * 详情比赛推送处理
   *
   * @param {object} event 推送的变化内容
   */
  onDetailDataChange (event) {
    if (self.detail.matchId !== event.data.mid) {
      return
    }
    // 如果是比赛状态变为完场, 直接从当前列表中删除
    if (event.nt === 1 && event.data.nst === 3) {
      self.detail = null
      return
    }
    if(isAlive(self.detail)) {
      self.detail.onDataChange(event)
    }
  },
  /**
   * 推送消息处理
   *
   * @param {object} event 推送过来的消息
   */
  onDataChange (event) {
    // 如果当前为详情, 则只对详情进行处理
    if (self.detail) {
      self.onDetailDataChange(event)
      return
    }

    // 过滤出列表关心的玩法
    if ([2, 4].includes(event.nt)) {
      // 过滤出当前推送中被关注到的玩法
      const changedMarkets = event.data.mks.filter(
        ({ ism, mgroup, mstage, mtype }) => (
          ism
          &&
          mgroup === 1
          &&
          mstage === 0
          &&
          LIST_MARKETS.includes(mtype)
        )
      )
      // 如果没有当前关注的玩法,则不再处理
      if (!changedMarkets.length) {
        return
      }

      // 更新列表, 只处理当前关注的玩法
      event.data.mks = changedMarkets
    }

    // 针对列表进行推送处理
    KEYS.forEach(key => {
      const listItem = self[key]
      if (listItem.list.length) {
        listItem.onDataChange(event)
      }
    })
  }
}))

export default {
  type,
  initial: () => {
    const instance = type.create({})
    instance.init()
    return instance
  }
}
