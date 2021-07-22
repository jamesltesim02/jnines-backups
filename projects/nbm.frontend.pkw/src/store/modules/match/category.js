import { types, isAlive } from 'mobx-state-tree'
import Match from './submodules/match-item'

const type = types.model(
  'Category',
  {
    /** 当前关注的玩法类别 */
    currentMarket: 0,
    matchs: types.array(Match.type)
  }
).views(self => ({
  get pushData () {
    if (!self.matchs.length) {
      return []
    }
    return [{
      sportId: self.matchs[0].sportId,
      marketType: self.currentMarket === 0 ? [1, 186] : [self.currentMarket],
      matchIds: self.matchs.map(({ matchId }) => matchId)
    }]
  }
})).actions(self => ({
  /** 添加比赛列表到页面中 */
  addMatchs (matchs = []) {
    matchs.forEach(match => {
      self.matchs.push(Match.initial(match))
    })
    self.prepareTourInList()
  },
  /** 设置当前的玩法类别 */
  setCurrentMarket (market) {
    self.currentMarket = market
  },
  /** 设置页面数据 */
  setData ({ matchs }) {
    self.matchs.clear()
    self.addMatchs(matchs)
  },
  prepareTourInList () {
    if(!self.matchs.length) {
      return
    }
    let group = {}
    self.matchs.forEach(match => {
      if (!isAlive(match)) {
        return
      }
      if (group.tid !== match.tournamentId) {
        group = {
          tid: match.tournamentId,
          mid: match.matchId,
          groupId: `${match.tournamentId}.${match.matchId}`
        }
      }
      match.setTourGroup(group)
    })
  },
  onDataChange (event) {
    if (!self.matchs.length) {
      return
    }

    // 如果非列表关注的玩法变化则不处理
    if (event.nt === 2) {
      const currMks = self.currentMarket === 0 ? [1, 186] : [self.currentMarket]
      // 过滤出当前推送中被关注到的玩法
      const changeMarkets = event.data.mks.filter(
        ({
          mtype,
          mstage,
          mgroup,
          ism
        }) => (
          currMks.includes(mtype)
          &&
          mstage === 0
          &&
          mgroup === 1
          &&
          ism
        )
      )
      // 如果没有当前关注的玩法,则不再处理
      if (!changeMarkets.length) {
        return
      }

      // 更新列表, 只处理当前关注的玩法
      event.data.mks = changeMarkets
    }

    // 事件对应的比赛id
    const eventMid = event.data.mid

    // 针对比赛列表处理
    if (self.matchs.length) {
      const matchIndex = self.matchs.findIndex(({ matchId }) => matchId === eventMid)
      // 如果是比赛状态变为完场, 直接从当前列表中删除
      if (event.nt === 1 && event.data.nst === 3) {
        self.matchs.splice(matchIndex, 1)
        self.prepareTourInList()
        // TODO 更新滚球 今日 早盘的数量
      } else {
        const eventMatch = self.matchs[matchIndex]
        if (eventMatch && isAlive(eventMatch)) {
          eventMatch.onDataChange(event)
        }
      }
    }
  }
}))

export default {
  type,
  initial: () => type.create({})
}