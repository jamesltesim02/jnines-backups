import { types, isAlive, active } from 'mobx-state-tree'

import Match from './match/match-item'

/** 
 * 列表查询时需要查询的玩法类型列表  
 *  
 *  1: 足球胜平负  
 *  186: 篮球胜负  
 *  16: 让分  
 *  18: 大小  
 */
const LIST_MARKETS = [1, 186, 16, 18]


const type = types.model(
  'Matchs',
  {
    marketTypes: types.array(types.number),
    list: types.array(Match.type),
    detail: types.maybeNull(Match.type),
    isChoosing: false,
    choosingMarket: types.maybeNull(types.frozen())
  }
).views(self => ({
  get pushData () {
    if (self.detail) {
      return [{
        sportId: self.detail.sportId,
        marketStage: -1,
        marketType: [-1],
        matchIds: [self.detail.matchId]
      }]
    }

    if (!self.list.length) {
      return []
    }
    const pd = []
    const marketTypes = self.marketTypes.slice()

    const m10 = self.list.filter(({ sportId }) => sportId === 10)
    const m11 = self.list.filter(({ sportId }) => sportId === 11)

    if (m10.length) {
      pd.push({
        sportId: 10,
        marketStage: 0,
        marketType: marketTypes,
        matchIds: m10.map(({ matchId }) => matchId)
      })
    }

    if (m11.length) {
      pd.push({
        sportId: 11,
        marketStage: 0,
        marketType: marketTypes,
        matchIds: m10.map(({ matchId }) => matchId)
      })
    }

    return pd
  },
  get choosing () {
    if (!self.choosingMarket) {
      return {
        match: {},
        market: {}
      }
    }

    const { matchId, marketType } = self.choosingMarket
    const match = self.list.find(m => m.matchId === matchId)
    const market = (match.markets || []).find(m => m.marketType === marketType)

    return {
      match,
      market
    }
  }
})).actions(self => ({
  /** 添加比赛列表到页面中 */
  addMatchs (list = []) {
    list.forEach(match => {
      self.list.push(Match.initial(match))
    })
  },
  /** 重新设置比赛列表 */
  setMatchs (list = []) {
    self.list.clear()
    self.addMatchs(list)
  },
  setMarketTypes (marketTypes) {
    self.marketTypes = marketTypes
  },
  setChooseMarket (market) {
    self.choosingMarket = market
  },
  /** 设置当前弹窗显示的玩法信息 */
  setChoosing (market) {
    self.isChoosing = !!market
    if (market) {
      self.setChooseMarket(market)
    } else {
      setTimeout(
        () => self.setChooseMarket(null),
        150
      )
    }
  },
  setDetail (detail) {
    self.detail = detail ? Match.initial(detail) : null
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

    if (!self.list.length) {
      return
    }

    // nt2 为赔率状态等变化
    if (
      [2, 4].includes(event.nt)
      &&
      self.marketTypes[0] !== -1
    ) {
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

    // 获取列表中对应的比赛
    const matchIndex = self.list.findIndex(
      ({ matchId }) => matchId === event.data.mid
    )
    if (matchIndex === -1) {
      return
    }

    // 如果是比赛状态变为完场, 直接从当前列表中删除
    if (event.nt === 1 && event.data.nst === 3) {
      self.list.splice(matchIndex, 1)
      return
    }

    // 触发对应事件
    const eventMatch = self.list[matchIndex]

    if(isAlive(eventMatch)) {
      eventMatch.onDataChange(event)
    }
  }
}))

export default {
  type,
  initial: () => type.create({})
}
