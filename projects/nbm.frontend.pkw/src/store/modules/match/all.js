import { types, isAlive } from 'mobx-state-tree'
import { reloadTime } from '../../../config/config.dev'

import Tour from './submodules/tour'

/** 首页相关比赛数据 */
const type = types.model(
  'AllMatch',
  {
    /** 当前关注的玩法类别 */
    currentMarket: 0,
    /** 热门赛事 */
    hot: types.array(Tour.type),
    /** 滚球 */
    live: types.map(types.array(Tour.type)),
    reloadVersion: 0,
    reloadTimer: types.maybeNull(types.frozen())
  }
).views(self => ({
  /** 推送上行数据 */
  get pushData () {
    const sportPd = []
    const addMatch = match => {
      let sport = sportPd.find(({ sportId }) => match.sportId === sportId)
      if (!sport) {
        sport = {
          sportId: match.sportId,
          marketStage: 0,
          marketType: self.currentMarket === 0 ? [1, 186] : [self.currentMarket],
          matchIds: []
        }
        sportPd.push(sport)
      }
      sport.matchIds.push(match.matchId)
    }
    self.hot.forEach(tour => tour.matchs.forEach(addMatch))
    self.live.forEach(sport => sport.forEach(tour => tour.matchs.forEach(addMatch)))

    return sportPd
  }
})).actions(self => ({
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
   * ### 添加比赛信息到滚球列表
   *
   * @param {object} match 比赛信息  
   */
  addLiveMatch (match) {
    let sport = self.live.get(match.sportId)
    if (!sport) {
      self.live.set(match.sportId, [])
      sport = self.live.get(match.sportId)
    }

    let tour = sport.find(({ id }) => id === match.tournamentId)
    if (!tour) {
      tour = Tour.initial({
        id: match.tournamentId,
        name: match.tournamentName,
        logo: match.tournamentLogo,
        sportId: match.sportId
      })
      sport.push(tour)
    }
    tour.addMatch(match)
  },
  /** 设置当前的玩法类别 */
  setCurrentMarket (market) {
    self.currentMarket = market
  },
  /** 设置页面数据 */
  setData(data) {

    self.hot.clear()
    self.live.clear()

    // 热门赛事添加到列表
    if (data.hot && data.hot.length) {
      data.hot.forEach(self.addHotMatch)
    }
    // 滚球赛事添加到列表
    if (data.live && data.live.length) {
      data.live.forEach(self.addLiveMatch)
    }
  },
  setReloadVersion (version) {
    self.reloadVersion = version
  },
  setTimer () {
    self.reloadTimer = setTimeout(
      () => {
        self.setReloadVersion(self.reloadVersion + 1)
      },
      reloadTime
    )
  },
  clearTimer () {
    self.reloadTimer = 0
    clearTimeout(self.reloadTimer)
  },
  /** 推送消息 */
  onDataChange (event) {
    // 如果非列表关注的玩法变化则不处理
    if ([2, 4].includes(event.nt)) {
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

    // 针对热门比赛处理
    if (self.hot.length) {
      // 获取比赛及联赛的位置
      let matchIndex, match
      const tourIndex = self.hot.findIndex(t => {
        matchIndex = t.matchs.findIndex(m => {
          if (m.matchId === eventMid) {
            match = m
            return true
          }
          return false
        })
        return matchIndex > -1
      })

      if (matchIndex > -1) {
        if (event.nt === 1 && event.data.nst === 3) {
          self.hot[tourIndex].matchs.splice(matchIndex, 1)
          if (!self.hot[tourIndex].matchs.length) {
            self.hot.splice(tourIndex, 1)
          }
        } else {
          isAlive(match) && match.onDataChange(event)
        }
      }
    }

    // 针对滚球进行处理
    // 获取事件对应体育类型
    const sport = self.live.get(event.data.spid)
    if (!sport) {
      return
    }

    // 查找比赛及联赛的位置
    let matchIndex
    let match
    const tourIndex = sport.findIndex(t => {
      matchIndex = t.matchs.findIndex(m => {
        if (m.matchId === eventMid) {
          match = m
          return true
        }
        return false
      })
      return matchIndex > -1
    })

    if (matchIndex === -1) {
      return
    }

    // 如果比赛变为完场, 则删除比赛
    if (event.nt === 1 && event.data.nst === 3) {
      // 删除比赛
      sport[tourIndex].matchs.splice(matchIndex, 1)
      // 如果此联赛下再无比赛,则删除联赛
      if (!sport[tourIndex].matchs.length) {
        sport.splice(matchIndex, 1)
      }
      // 如果体育类型下再无联赛,则删除体育类型
      if (!sport.length) {
        self.live.delete(event.data.spid)
      }
      return
    }

    // 其他事件直接交给match对象来触发
    isAlive(match) && match.onDataChange(event)
  }
}))

export default {
  type,
  initial: () => type.create({})
}
