import { types, isAlive } from 'mobx-state-tree'
import { availableSports } from '../../../config/config.dev'

import { initializeStore } from '../../'

// import Match from './submodules/match-item'
import Tour from './submodules/tour'

/** 一组体育项相关比赛 */
const type = types.model(
  'Favorite',
  {
    /** 当前关注的玩法类别 */
    currentMarket: 0,
    /** 收藏列表页面的比赛数据 */
    sports: types.map(types.array(Tour.type)),
    /** 用户收藏的所有比赛id列表 */
    ids: types.array(types.string)
  }
).views(self => ({
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
    self.sports.forEach(
      sport => sport.forEach(
        tour => tour.matchs.forEach(addMatch)
      )
    )

    return sportPd
  },
  /** 比赛的id列表 */
  get mids () {
    if (self.sports.size === 0) {
      return []
    }

    const idlist = []
    availableSports.forEach(sid => {
      const tours = self.sports.get(sid)
      if (tours) {
        tours.forEach(t => {
          idlist.push(...t.mids)
        })
      }
    })

    return idlist
  }
})).actions(self => ({
  /** 设置收藏的比赛列表 */
  setFavids (ids) {
    self.ids = ids
  },
  /** 添加收藏 */
  add (mid) {
    self.ids.push(mid)

    // 新注单数量累计
    const store = initializeStore()
    store.app.setNewFav(store.app.newFav + 1)
  },
  /** 删除收藏 */
  delete (mids) {
    if (Array.isArray(mids)) {
      self.ids = self.ids.filter(id => !mids.includes(id))
    } else {
      const index = self.ids.findIndex(id => id === mids)
      if (index !== -1) {
        self.ids.splice(index, 1)
      }
    }
  },
  /**
   * ### 添加比赛信息到滚球列表
   *
   * @param {object} match 比赛信息  
   */
  addMatchs (match) {
    let sport = self.sports.get(match.sportId)
    if (!sport) {
      self.sports.set(match.sportId, [])
      sport = self.sports.get(match.sportId)
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
  /** 设置当前页数据 */
  setData (data) {
    self.sports.clear()
    if (data && data.length) {
      data.forEach(self.addMatchs)
    }
  },
  /** 推送消息 */
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

    // 获取事件对应体育类型
    const sport = self.sports.get(event.data.spid)
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
        self.sports.delete(event.data.spid)
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