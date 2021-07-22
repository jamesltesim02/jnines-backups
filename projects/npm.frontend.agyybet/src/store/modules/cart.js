import { types, isAlive } from 'mobx-state-tree'

import { initializeStore } from '../'

import MatchItem from './match-modeuls/match-item'
import Market from './match-modeuls/market'

const CartOption = types.model(
  'CartOption',
  {
    /** 投注项id */
    optionId: types.string,
    /** 盘口值 */
    betBar: types.string,
    /** 投注项标识 */
    betOption: types.string,
    /** 赔率 */
    odds: types.number,
    /** 原始赔率只用作串关弹窗收起后显示 */
    defaultOdds: types.number,
    /**
     * 投注项状态  
     *
     * -1: 可见不可投  
     *  0: 不可见  
     *  1: 可见可投  
     */
    status: types.number,
    /**
     * 赔率变化状态  
     * 小于0: 赔率降低
     * 0: 赔率没有变化
     * 大于0: 赔率升高
     */
    oddsStatus: 0,
    /** 至少串关数 */
    combCount: 0,
    /** 不可投描述 */
    errMsg: '',
    /** 早盘投注额 */
    earlyAmount: 0,
    /** 早盘总注数 */
    earlyCount: 0,
    /** 滚球投注额 */
    liveAmount: 0,
    /** 滚球总注数 */
    liveCount: 0,
    /** 最高投注额 */
    maxBet: 0,
    /** 最高返还额 */
    maxReturn: 0,
    /** 最低投注额 */
    minBet: 10,
    /** 比赛信息 */
    match: types.maybeNull(MatchItem.type),
    /** 玩法信息 */
    market: types.maybeNull(Market.type),
    /** 当前投注额 */
    amount: types.maybeNull(types.number)
  }
).actions(self => ({
  update (nopt) {
    self.status = nopt.status
    self.errMsg = nopt.errorMsg
    self.oddsStatus = nopt.odds - self.odds
    self.odds = nopt.odds
    self.defaultOdds = nopt.odds
  }
}))

const type = types.model(
  'Cart',
  {
    /** 当前已选中的option列表 */
    options: types.array(CartOption),
    /** 投注模式 0: 单式, 1: 串关 */
    model: types.maybeNull(types.number),
    /** 最低投注额 */
    multiMin: 2,
    /** 最高投注额 */
    multiMax: 0,
    result: types.maybeNull(types.frozen()),
    // Order finished version, 每接收到更新就更新一次version
    ofv: 0
  }
).views(self => ({
  /** 购物车中的数量 */
  get size () {
    return self.options.length
  },
  /** 获取所有可投注option */
  get availableOptions () {
    return self.options.filter(({ status }) => status === 1)
  },
  /** 可投投注项数量 */
  get availableSize () {
    return self.availableOptions.length
  },
  /** 最大需要的串关数 */
  get maxCombo () {
    return Math.max(
      ...self.options.map(({ combCount }) => combCount)
    )
  },
  /** 获取总赔率 */
  get odds () {
    if (!self.availableSize) {
      return 0
    }
    return self.availableOptions.reduce(
      (current, { odds }) => {
        return (
          current.toFixed(3).replace(/\./gi, '')
          *
          odds.toFixed(3).replace(/\./gi, '')
          /
          1000000
        )
      },
      1
    )
  },
  get defaultOdds () {
    if (!self.size) {
      return '0.00'
    }

    return self.options.reduce(
      (current, { defaultOdds }) => {
        return (
          current.toFixed(3).replace(/\./gi, '')
          *
          defaultOdds.toFixed(3).replace(/\./gi, '')
          /
          1000000
        )
      },
      1
    )
  },
  /** 获取推送需要注册的数据列表 */
  get pushData () {
    return self.options.map(
      ({
        optionId,
        match: { matchId },
        market: { marketId }
      }) => ({
        matchId,
        marketId,
        optionId
      })
    )
  }
})).actions(self => ({
  setModel (model) {
    if (model === 0) {
      self.clear()
    }
    self.model = model
  },
  add (
    option,
    { options, ...market },
    { markets, ...match },
  ) {
    const index = self.options.findIndex(({ match: { matchId } }) => {
      return matchId === match.matchId
    })
    if (index !== -1) {
      self.options.splice(index, 1)
    }
    const cartOption = CartOption.create({
      ...option,
      defaultOdds: option.odds,
      market: Market.initial(market),
      match: MatchItem.initial(match)
    })

    self.options.push(cartOption)
  },
  delete (oid) {
    const index = self.options.findIndex(({ optionId}) => optionId === oid)
    if (index === -1) {
      return
    }
    self.options.splice(index, 1)
  },
  clear () {
    self.options.clear()
  },
  updateOptions (options) {
    options.forEach(option => {
      const opt = self.options.find(({ optionId }) => optionId === option.optionId)
      if (isAlive(opt)) {
        opt.update(option)
      }
    })
  },
  setRange (min, max) {
    self.multiMin = min
    self.multiMax = max
  },
  setResult (result) {
    self.result = result
    if (!result) {
      self.clear()
    }
  },
  // nt1 比赛状态变化, 如果完场则删除投注项
  onMatchStateChange (event) {
    // 如果不是完场,则忽略处理
    if (event.data.nst !== 3) {
      return
    }

    const index = self.options.findIndex(({ match }) => match.matchId = event.data.mid)
    if (index > 0) {
      self.options.splice(index, 1)
    }
  },
  // nt2 投注项赔率或状态变化
  onOptionDataChange (event) {
    event.data.mks.forEach(market => {
      market.ops.forEach(opt => {
        const index = self.options.findIndex(({ optionId }) => optionId === opt.oid)
        if (index === -1) {
          return
        }
        // 如果投注项状态变为0,则直接删除投注项
        if (opt.bst === 0) {
          self.options.splice(index, -1)
          return
        }

        const option = self.options[index]
        if(option && isAlive(option)) {
          option.update({
            errorMsg: '',
            status: opt.bst,
            odds: opt.odds
          })
        }
      })
    })
  },
  // nt5 整场拉盘, 删除对应投注项
  onMatchUnavailable (event) {
    const index = self.options.findIndex(({ match }) => match.matchId = event.data.mid)
    if (index > 0) {
      self.options.splice(index, 1)
    }
  },
  // nt100 注单状态发生变化
  onOrderStateChange (event) {
    const result = event.data
    self.ofv = self.ofv + 1
    if (!self.result || self.result.ticketId !== result.ticketId) {
      return
    }

    // 新注单数量累计
    const store = initializeStore()
    store.app.setNewOrder(store.app.newOrder + 1)

    self.result = {
      ...self.result,
      code: result.errorCode,
      msg: result.errorMsg
    }

    // 还原投注失败的金额
    if (result.errorCode !== 200) {
      store.member.setBalance(
        store.member.memberInfo.balance
        +
        self.result.amount
      )
    }
  },
  /** 推送事件 */
  onDataChange (event) {
    if(!isAlive(self)) {
      return
    }
    if (self.result) {
      // 注单变化
      if (event.nt === 100) {
        self.onOrderStateChange(event)
      }
      return
    }
    const eventMapping = {
      // 比赛状态变化
      1: self.onMatchStateChange,
      // 投注项状态或赔率变化
      2: self.onOptionDataChange,
      // 整场拉盘
      5: self.onMatchUnavailable,
    }

    const eventHandler = eventMapping[event.nt]
    if (eventHandler) {
      eventHandler(event)
    }
  }
}))

export default {
  type,
  initial: () => type.create({})
}