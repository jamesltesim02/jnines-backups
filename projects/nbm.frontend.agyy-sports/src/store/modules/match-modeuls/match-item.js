import { types } from 'mobx-state-tree'

import Market from './market'

/** 推送事件对应的处理函数名称 */
const MATCH_EVENTS = {
  // 比赛状态变化
  1: 'onStateChange',
  // 赔率变化
  2: 'onItemDataChange',
  // 主盘变化
  4: 'onItemDataChange',
  // 比赛拉盘
  5: 'onMatchUnavailable',
  // 比赛时间变化
  6: 'onTimeChange',
  // 比赛比分变化
  7: 'onScoreChange',
  // 玩法数量变化
  20: 'onMarketCountChange',
  // 红包开始事件
  1001: 'onRedEnvelopeStart',
  // 红包结束事件
  1002: 'onRedEnvelopeEnd'
}

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
    /** 焦点比赛时传的图片 */
    logo: types.string,
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
    /** 本场比赛主要玩法的投注量统计值 */
    betStatistics: types.maybeNull(types.frozen()),
    /** 活动信息 */
    activityInfo: types.maybeNull(types.frozen()),
  }
).views(self => ({
  get categories () {
    const allCategories = ['all']

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
  },
  get actId () {
    const actId = (self.activityInfo || {}).actId;
    if (
      self.isLive
      &&
      Boolean(actId)
      &&
      actId !== '0'
    ) {
      return actId;
    }
    return undefined;
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
        marketStage,
        marketParam,
      }) => (
        marketType === market.marketType
        &&
        marketStage === market.marketStage
        &&
        marketGroup === market.marketGroup
        &&
        marketParam === market.marketParam
      )
    )
    if (!savedMarket) {
      self.markets.push(Market.initial(market))
    } else {
      savedMarket.addOptions(market)
    }
  },
  /** 设置是否需要显示联赛标题 */
  setTourGroup (group) {
    self.tourGroup = group
  },
  /** 设置玩法投注量统计值 */
  setBetStatistics (statistics) {
    self.betStatistics = statistics
  },
  /** nt1 比赛状态变化 */
  onStateChange (event) {
    self.matchState = event.data.nst
  },
  /** nt2, nt4, 投注项赔率或主盘变化, 分发到玩法对象上处理 */
  onItemDataChange (event) {
    event.data.mks.forEach(emarket => {
      const market = self.markets.find(({
        marketGroup,
        marketType,
        marketStage,
        marketParam,
      }) => (
        marketType === emarket.mtype
        &&
        marketStage === emarket.mstage
        &&
        marketGroup === emarket.mgroup
        &&
        marketParam === emarket.mParam
      ))
      // 如果当前玩法不存在, 添加到页面中
      if (!market) {
        if (
          !emarket.ops
          ||
          !emarket.ops.length
          ||
          emarket.ops.filter(
            ({ bst }) => bst === 0
          ).length === 0
          ||
          (
            event.forList
            &&
            !emarket.ism
          )
        ) {
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
          marketParam: emarket.mParam,
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
        // 详情则直接触发
        if (!event.forList) {
          market.onOddsStatusChange(emarket)
          return
        }

        // 列表处理
        if (
          // 如果当前market为主盘并且当前列表上无投注项则触发
          (
            emarket.ism
            &&
            !market.options.length
          )
          ||
          // 如果当前event的options和列表已有options完全重合则触发
          (
            market.options.filter(
              ({ optionId }) => !!emarket.ops.find(opt => opt.oid === optionId)
            ).length === emarket.ops.length
          )
        ) {
          market.onOddsStatusChange(emarket)
        }
        return
      }

      // 主盘变化
      market.onMainGameChange(emarket)
    })
  },
  /** nt5 整场拉盘 */
  onMatchUnavailable () {
    self.markets.clear()
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
      return
    }

    // 角球
    if (event.data.etype === 2) {
      self.matchStatistic = {
        ...self.matchStatistic,
        corners: event.data.score
      }
      return
    }

    // 黄牌
    if (event.data.etype === 3) {
      self.matchStatistic = {
        ...self.matchStatistic,
        yellowCard: event.data.score
      }
      return
    }

    // 红牌
    if (event.data.etype === 4) {
      self.matchStatistic = {
        ...self.matchStatistic,
        redCard: event.data.score
      }
      return
    }
  },

  /**
   * nt20 玩法数量变化
   *
   * @param event 事件内容
   */
  onMarketCountChange (event) {
    self.matchMarket = event.data.mkCount
  },

  /** nt1001 红包开始事件 */
  onRedEnvelopeStart (event) {
    self.activityInfo = {
      actId: event.data.actId,
      show: true,
    }
  },

  /** nt1002 红包结束事件 */
  onRedEnvelopeEnd (event) {
    if (
      !self.activityInfo
      ||
      self.activityInfo.actId !== event.data.actId
    ) {
      return;
    }
    self.activityInfo = {
      actId: event.data.actId,
      show: false,
    }
  },

  /**
   * 该比赛对应的推送处理
   *
   * @param {object} event 推送消息内容
   */
  onDataChange (event) {
    const eventHandler = self[MATCH_EVENTS[event.nt]]
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