import { types, isAlive } from 'mobx-state-tree'
import Match from './submodules/match-item'
import Tour from './submodules/tour'
/** 一组体育项相关比赛 */
const type = types.model(
  'Sport',
  {
    /** 当前关注的玩法类别 */
    currentMarket: 0,
    /** 当前页的比赛列表 */
    matchs: types.array(Match.type),
    /** 热门比赛 */
    hot: types.array(Tour.type),
  }
).views(self => ({
  /** 获取推送数据 */
  get pushData () {
    if (!self.matchs.length && !self.hot.length) {
      return []
    }

    const sportId = (
      self.matchs.length
      ? self.matchs [0]
      : self.hot[0]
    ).sportId

    return [
      {
        sportId,
        marketStage: 0,
        marketType: self.currentMarket === 0 ? [1, 186] : [self.currentMarket],
        matchIds: [
          ...self.matchs.map(({ matchId }) => matchId),
          ...self.hot.map(({ matchs }) => matchs.map(({ matchId }) => matchId)).flat()
        ]
      }
    ]
  },
})).actions(self => ({
  /** 添加比赛列表到页面中 */
  addMatchs (matchs = []) {
    matchs.forEach(match => {
      self.matchs.push(Match.initial(match))
    })
    self.prepareTourInList()
  },
  /** 重新设置比赛列表 */
  setMatchs (matchs = []) {
    self.matchs.clear()
    self.addMatchs(matchs)
  },
  /**
   * ### 添加比赛信息到热门列表  
   *
   * @param {object} match 比赛信息  
   */
  addHotMatch (match) {
    let tour = self.hot.find(({ id }) => id === match.tournamentId)
    if (!tour) {
      tour = Tour.initial({
        id: match.tournamentId,
        name: match.tournamentName,
        logo: match.tournamentLogo,
        sportId: match.sportId
      })
      self.hot.push(tour)
    }
    tour.addMatch(match)
  },
  /**
   * 整理比赛列表分组
   */
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
  /** 设置热门比赛数据 */
  setHot (matchs = []) {
    self.hot.clear()
    matchs.forEach(this.addHotMatch)
  },
  /** 设置当前的玩法类别 */
  setCurrentMarket (market) {
    self.currentMarket = market
  },
  /** 设置初始化数据 */
  setData (data = {}) {
    const {
      matchs,
      hot: hotMatchs
    } = data

    self.matchs.clear()
    self.hot.clear()

    if (matchs) {
      self.setMatchs(matchs)
    }
    if (hotMatchs) {
      self.setHot(hotMatchs)
    }
  },
  /**
   * 推送消息处理
   *
   * @param {object} event 推送过来的消息
   */
  onDataChange (event) {
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
          // &&
          // ism
        )
      )
      // 如果没有当前关注的玩法,则不再处理
      if (!changeMarkets.length) {
        return
      }

      // 设置当前事件为列表上触发的事件
      event.forList = true
      // 更新列表, 只处理当前关注的玩法
      event.data.mks = changeMarkets
    }

    // 事件对应的比赛id
    const eventMid = event.data.mid

    // 针对比赛列表处理
    if (self.matchs.length) {
      const matchIndex = self.matchs.findIndex(({ matchId }) => matchId === eventMid)
      // 如果是比赛状态变化, 直接从当前列表中删除
      if (event.nt === 1) {
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

    // 针对热门比赛处理
    if (self.hot.length) {
      let matchIndex

      const tourIndex = self.hot.findIndex(t => {
        if (!t.matchs || !t.matchs.length) {
          return false
        }
        matchIndex = t.matchs.findIndex(m => m.matchId === eventMid)
        return matchIndex > -1
      })

      if (matchIndex === -1) {
        return
      }

      // 如果是完场直接删除比赛
      if (event.nt === 1 && event.data.nst === 3) {
        self.hot[tourIndex].matchs.splice(matchIndex, 1)
        if (!self.hot[tourIndex].matchs.length) {
          self.hot.splice(tourIndex, 1)
        }
        return
      }

      // 否则往下层触发事件
      const match = self.hot[tourIndex].matchs[matchIndex]
      isAlive(match) && match.onDataChange(event)
    }
  }
}))

export default {
  type,
  initial: () => type.create({})
}