import { types, isAlive } from 'mobx-state-tree'

import Market from './market'

/** 联赛信息 */
const type = types.model(
  'MatchItem',
  {
    /** 比赛id */
    matchId: types.string,
    /** 比赛名称 */
    matchName: types.string,
    /** 数据提供商 */
    provider: types.frozen(),
    /**
     * ### 比赛状态  
     * 0	Early	早盘未开赛
     * -1	Today	今日
     * 1	Live	滚球进行中
     * 3	End	正常结束
     * 4	Delay	延期
     * 5	Cut	腰斩
     */
    matchState: types.number,
    /** 当前玩法数 */
    matchMarket: types.number,
    /** 比赛开始时间(时间戳) */
    matchDate: types.string,
    /** 主队logo */
    logo1: types.string,
    /** 客队logo */
    logo2: types.string,
    /** 体育类型id, 10: 足球 11: 篮球 99: 电竞 */
    sportId: types.number,
    /** 联赛id */
    tournamentId: types.string,
    /** 联赛名称 */
    tournamentName: types.string,
    /** 联赛logo */
    tournamentLogo: types.string,
    /** 数据统计 */
    matchStatistic: types.maybeNull(types.frozen()),
    /** 玩法列表 */
    markets: types.array(Market.type),
    /** 直播源id */
    nanoId: types.maybeNull(types.string),
    /** 直播地址 */
    liveUrl: types.maybeNull(types.string),
    /** 滚球状态 */
    liveState: types.maybeNull(types.number),
    /** 滚球时间 */
    liveTime: types.maybeNull(types.frozen()),
    /** 滚球比分 */
    liveScore: types.maybeNull(types.frozen()),
    /** 在普通比赛列表时, 是否需要显示联赛标题 */
    tourGroup: types.maybeNull(types.frozen()),

  }
).views(self => ({
  get categories () {
    const allCategories = []

    self.markets.forEach(market => {
      if (
        !market.options.length
        ||
        // group为5时表示谁先开球, 不添加到任何分组
        market.marketGroup === 5
      ) {
        return
      }
      let category = market.marketCategory

      // 足球的角球和半场处理
      if (self.sportId === 10) {
        // 角球玩法分拣到角球中
        // 半场角球也只放到角球分组中
        // 不在半场分组中显示
        if (market.marketGroup === 2) {
          category = 5
        }
        // 半场单独分拣到半场分组中
        else if ([1, 2].includes(market.marketStage)) {
          category = 3
        }
      }
      // 篮球的单节玩法处理
      else if (self.sportId === 11) {
        // 篮球分拣单节玩法分组
        if([51, 52, 53, 54].includes(market.marketStage)) {
          category = 7
        }
      }

      if (
        category !== 0
        &&
        !allCategories.includes(category)
      ) {
        allCategories.push(category)
      }
    })

    /** 玩法分类 */
    return allCategories.sort((v1, v2) => v1 - v2)
  }
})).actions(self => ({
  /**
   * ### 添加玩法信息到当前比赛中
   *
   * @param {object} market 玩法信息
   */
  addMarket (market) {
    if (!market.marketId) {
      return
    }
    const savedMarket = self.markets.find(
      ({
        marketGroup,
        marketType,
        marketStage
      }) => (
        marketType === market.marketType
        &&
        marketStage === market.marketStage
        &&
        marketGroup === market.marketGroup
      )
    )
    if (!savedMarket) {
      self.markets.push(Market.initial(market))
    } else {
      savedMarket.addOptions(market)
    }
  },
  setTourGroup (group) {
    self.tourGroup = group
  },
  /** nt1 比赛状态变化 */
  onStateChange (event) {
    self.matchState = event.data.nst
  },
  /** nt6 比赛时间变化 */ 
  onTimeChange (event) {
    self.liveTime = {
      reamindTime: event.data.rtime,
      remaindTimeInPeriod: event.data.rptime,
      runTime: event.data.time,
      stoppageTime: event.data.stime,
      stoppageTimeAnnounced: event.data.satime,
      timeRun: event.data.run,
      matchPeriod: event.data.period
    }
  },
  /** nt5 整场拉盘 */
  onMatchUnavailable () {
    self.markets.clear()
  },
  /**
   * nt7 比分变化
   * 
   * 1 比分 2角球 3黄牌 4红牌
   *
   * @param {object} even 事件内容
   */
  onScoreChange (event) {
    // 比分
    if (event.data.etype === 1) {
      self.liveScore = {
        ...self.liveScore,
        score: event.data.score
      }
    }

    // 角球
    if (event.data.etype === 2) {
      self.matchStatistic = {
        ...self.matchStatistic,
        corner: event.data.score
      }
    }

    // 红牌
    if (event.data.etype === 4) {
      self.matchStatistic = {
        ...self.matchStatistic,
        redCard: event.data.score
      }
    }
  },
  /**
   * 该比赛对应的推送处理
   *
   * @param {object} event 推送消息内容
   */
  onDataChange (event) {
    if(!isAlive(self)) {
      return
    }

    // 投注项赔率状态变化, 主盘变化直接分发到玩法对象上处理
    if ([2, 4].includes(event.nt)) {
      event.data.mks.forEach(emarket => {
        const market = self.markets.find(({
          marketGroup,
          marketType,
          marketStage
        }) => (
          marketType === emarket.mtype
          &&
          marketStage === emarket.mstage
          &&
          marketGroup === emarket.mgroup
        ))
// if (process.env.NODE_ENV !== 'production') {
//   console.log(`
//   -------------------------------比赛赔率或主盘变化[${event.nt}]-----------------------------------
//   比赛id: ${event.data.mid}

//   当前盘口:
//   ${
//     market ? (
//       market.options
//       // .filter(({ main }) => main)
//       .map(opt => `oid: ${opt.optionId} | bar: ${opt.betBar} | option: ${opt.betOption} | status: ${opt.status} | odds: ${opt.odds} | type: ${market.marketType} | stage: ${market.marketStage}`)
//       .join('\n')
//     ) : ('')
//   }

//   更新盘口:
//   ${
//   event.data.mks.map(m => (
//   `marketid: ${m.gid} | bar: ${m.betbar} | main: ${m.ism} | type: ${m.mtype} | stage: ${m.mstage}
//   ${
//   m.ops.map(
//     opt => `  oid: ${opt.oid} | option: ${opt.bop} | status: ${opt.bst} | odds: ${opt.odds}`
//   ).join('\n')
//   }
//   `
//   )).join('\n')
//   }
//   ------------------------------------------------------------------------------------

//   `)
// }
        // 如果当前玩法不存在, 添加到页面中
        if (!market) {
          if (!emarket.ops || !emarket.ops.length) {
            return
          }
          self.addMarket({
            marketId: emarket.gid,
            matchId: event.data.mid,
            marketType: emarket.mtype,
            marketGroup: emarket.mgroup,
            marketStage: emarket.mstage,
            marketCategory: emarket.category,
            betBar: emarket.betbar,
            main: emarket.ism,
            orderNo: emarket.num,
            combo: emarket.combo,
            options: emarket.ops.map(opt => ({
              optionId: opt.oid,
              betOption: opt.bop,
              odds: opt.odds,
              status: opt.bst,
              orderNo: opt.num
            }))
          })
          return
        }

        // 赔率或状态变化
        if (event.nt === 2) {
          market.onOddsStatusChange(emarket)
        }
        // 主盘变化
        else {
          market.onMainGameChange(emarket)
        }
      })
      return
    }

    const eventMap = {
      // 比赛状态变化
      1: self.onStateChange,
      // 比赛时间变化
      6: self.onTimeChange,
      // 比赛拉盘
      5: self.onMatchUnavailable,
      // 比赛比分变化
      7: self.onScoreChange
    }
    const eventHandler = eventMap[event.nt]
    if (eventHandler) {
      eventHandler(event)
    }
  }
}))

export default {
  type,
  initial: ({
    markets,
    ...match
  } = {}) => {
    if (!match || !match.matchId) {
      return null
    }
    if (match.matchState === 1) {
      match.liveTime = {
        ...match.liveTime,
        matchPeriod: match.matchPeriod
      }
    }
    const instance = type.create(match)
    if (markets && markets.length) {
      markets.forEach(instance.addMarket)
    }

    return instance
  }
}