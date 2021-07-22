import { types } from 'mobx-state-tree'

/** 投注项type */
const Option = types.model(
  'Option',
  {
    /** 投注项类型 */
    betOption: types.string,
    /** 赔率 */
    odds: types.number,
    /** 主键 */
    optionId: types.string,
    /**
     * 投注项状态  
     *
     * -1: 可见不可投  
     *  0: 不可见  
     *  1: 可见可投  
     */
    status: types.number,
    /** 早盘投注额 */
    earlyAmount: types.maybeNull(types.number),
    /** 早盘总注数 */
    earlyCount: types.maybeNull(types.number),
    /** 滚球投注额 */
    liveAmount: types.maybeNull(types.number),
    /** 滚球总注数 */
    liveCount: types.maybeNull(types.number),
    /** 最高投注额 */
    maxBet: 0,
    /** 最高返还额 */
    maxReturn: 0,
    /** 最低投注额 */
    minBet: 10,
    /** 待投注金额 */
    willBetAmount: 0,
    /** 已投注金额 */
    betedAmount: 0,
    /** 是否投注成功 */
    betsuccess: false,
  }
).views(self => ({
  get maxAmount () {
    return Math.min(
      self.maxReturn / (self.odds || 1),
      self.maxBet
    )
  }
})).actions(self => ({
  /** 添加待投注金额 */
  addAmount (amount) {
    let newAmount = self.willBetAmount + amount
    if (newAmount > self.maxAmount) {
      newAmount = Math.max(self.maxAmount - (self.maxAmount % 10), 0)
    }
    self.willBetAmount = newAmount
  },
  /** 清空待投额度 */
  clearAmount () {
    self.willBetAmount = 0
  },
  /** 点水后更新数据 */
  updateByQuote (data) {
    Object.assign(self, data)
  },
  /** 设置是否为刚投注成功 */
  setBetsuccess () {
    self.betsuccess = true
    // setTimeout(self.updateLiveAmount.bind(self), 300)
  },
  updateLiveAmount () {
    self.liveAmount = self.liveAmount + self.willBetAmount
    self.liveCount = self.liveCount + 1
    self.willBetAmount = 0
    self.betsuccess = false
  }
}))
const createOption = option => Option.create(option)

/** 玩法type */
const Market = types.model(
  'Market',
  {
    marketId: types.string,
    betBar: types.string,
    marketType: types.number,
    marketGroup: types.number,
    marketStage: types.number,
    options: types.array(Option)
  }
).actions(self => ({
  /** 添加投注项到玩法中 */
  addOption (option) {
    self.options.push(createOption(option))
  },
  /** 清空所有待投注金额 */
  clearAmount () {
    if (self.options && self.options.length) {
      self.options.forEach(option => {
        option.clearAmount()
      })
    }
  }
}))
const createMarket = ({
  options,
  ...marketData
}) => {
  const market = Market.create(marketData)

  if (options && options.length) {
    options.forEach(option => market.addOption(option))
  }

  return market
}

/** 比赛type */
const Matchinfo = types.model(
  'Match',
  {
    /** 体育类型id */
    sportId: types.number,
    /** 比赛ID */
    matchId: types.string,
    /** 联赛名称 */
    tournamentName: types.string,
    /** 比赛名称,如: 利物浦 vs 谢菲尔德 */
    matchName: types.string,
    /** 主队logo */
    logo1: types.maybeNull(types.string),
    /** 客队logo */
    logo2: types.maybeNull(types.string),
    /** 比赛时间 */
    matchDate: types.maybeNull(types.number),
    /** 当前比赛的玩法列表 */
    markets: types.map(Market)
  }
).views(self => ({
  /** 当前比赛下的所有option */
  get options () {
    const olist = []
    if (self.markets && self.markets.size) {
      self.markets.forEach(market => olist.push(...market.options))
    }
    return olist
  }
})).actions(self => ({
  /** 添加玩法到比赛中 */
  addMarket (market) {
    self.markets.set(market.marketType, createMarket(market))
  },
  /** 清空所有待投注金额 */
  clearAmount () {
    if (self.markets && self.markets.size) {
      self.markets.forEach(market => market.clearAmount())
    }
  }
}))
const createMatchinfo = ({
  /** 当前比赛的玩法列表 */
  markets,
  matchDate,
  /** 其他比赛信息 */
  ...matchData
}) => {
  const matchinfo = Matchinfo.create({
    matchDate: +matchDate,
    ...matchData
  })

  if (markets && markets.length) {
    markets.forEach(market => matchinfo.addMarket(market))
  }

  return matchinfo
}

/** 精选state type */
const type = types.model(
  'Featured',
  {
    /**
     * 当前选中的筹码值 
     *  {
     *    value: 筹码值
     *    rect: { 筹码的位置信息
     *      x,
     *      y,
     *      width,
     *      height,
     *      top,
     *      right,
     *      bottom,
     *      left,
     *    }
     *  }
     */
    chip: types.maybeNull(types.frozen()),
    /**
     * 当前比赛信息
     */
    matchinfo: types.maybeNull(Matchinfo)
  }
).actions(self => ({
  /** 设置当前选中的筹码 */
  setChip (chip) {
    self.chip = chip
  },
  /** 设置比赛信息 */
  setMatchInfo (matchinfo) {
    self.matchinfo = createMatchinfo(matchinfo)
  },
  /** 取消投注, 清空所有额度 */
  cancelBet() {
    if (self.matchinfo) {
      self.matchinfo.clearAmount()
    }
  }
}))

export default {
  type,
  initial: () => type.create({
    chip: null,
    matchinfo: null
  })
}
