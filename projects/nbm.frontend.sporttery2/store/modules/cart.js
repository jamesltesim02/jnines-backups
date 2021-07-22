import { types, isAlive } from 'mobx-state-tree'

import { isServer } from '../../utils/env-utils'

import Match from './match/match-item'
import Market from './match/market'

import { initializeStore } from '../'

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
    maxBet: 999,
    /** 最高返还额 */
    maxReturn: 0,
    /** 最低投注额 */
    minBet: 10,
    /** 比赛信息 */
    match: types.maybeNull(Match.type),
    /** 玩法信息 */
    market: types.maybeNull(Market.type),
    /** 当前投注额 */
    amount: types.maybeNull(types.number)
  }
).actions(self => ({
  /**
   * 更新投注项状态  
   *
   * @param {number} status 最新状态  
   */
  setStatus (status) {
    self.status = status
  },
  /**
   * 更新赔率
   * @param {number} odds 新赔率
   */
  setOdds (odds) {
    if (isAlive(self)) {
      self.oddsStatus = odds - self.odds
      self.odds = odds
    }
  },
  resetOddsChange () {
    self.oddsStatus = 0
  },
  update (nopt) {
    self.maxBet = nopt.maxBet
    self.minBet = nopt.minBet
    self.maxReturn = nopt.maxReturn
    self.status = nopt.status
    self.setOdds(nopt.odds)
  },
  setAmount (amount) {
    self.amount = amount
  }
}))

const BetResult = types.model(
  'BetResult',
  {
    ticketId: types.string,
    betType: types.number,
    bets: types.frozen(),
    options: types.array(types.string),
    status: 0,
    msg: types.maybeNull(types.string)
  }
).actions(self => ({
  updateResult (result) {
    self.status = result.status
    self.msg = result.msg
  }
}))

const type = types.model(
  'Cart',
  {
    /** 当前是否为竞彩投注 */
    lottery: false,
    /** 投注框是否展开 */
    panelActive: false,
    /** 当前已选中的option列表 */
    options: types.array(CartOption),
    /** 当前输入项 */
    inputing: types.maybeNull(types.number),
    /** 串关相关信息 */
    comboInfo: types.maybeNull(types.frozen()),
    /** 串关投注额 */
    comboAmount: types.maybeNull(types.number),
    /** 批量单式投注额 */
    batchAmount: types.maybeNull(types.number),
    /** 投注结果 */
    betResult: types.array(BetResult),
    /** 跟单结果 */
    followTicket: types.maybeNull(types.frozen())
  }
).views(self => ({
  get curr () {
    if (
      self.options.length === 0
      ||
      self.inputing === null
    ) {
      return { amount: null }
    }

    // 批量单式
    if (self.inputing === -1) {
      return self.bopt
    }

    // 串关
    if (self.inputing === -2) {
      return self.copt
    }

    return self.options[self.inputing]
  },
  get bopt () {
    return {
      amount: self.batchAmount,
      odds: Number(
        self.options.reduce(
          (curr, o) => o.odds + curr, 0
        )
        /
        self.options.length
      ).toFixed(2),
      minBet: Math.max(...self.options.map(({ minBet }) => minBet)),
      maxBet: Math.min(...self.options.map(({ maxBet }) => maxBet))
    }
  },
  get copt () {
    return {
      amount: self.comboAmount,
      ...(
        self.comboInfo
        ||
        {
          odds: Number(
            self.options.reduce(
              (curr, o) => o.odds * curr,
              1
            )
          ).toFixed(2),
          minBet: 10,
          maxBet: 999
        }
      )
    }
  },
  get totalAmount () {
    if (self.options.length === 0) {
      return 0
    }
    let amount = self.options.reduce((curr, o) => curr + (o.amount || 0), 0)
    return Number(amount + (self.comboAmount || 0)).toFixed(2)
  },
  get totalReturn () {
    if (self.options.length === 0) {
      return 0
    }
    let value = self.options.reduce(
      (curr, o) => (
        curr
        +
        ((o.amount || 0) * o.odds)
      ),
      0
    )
    if (self.comboAmount > 0) {
      value += ((self.comboAmount || 0) * self.copt.odds)
    }
    return Number(value).toFixed(2)
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
  },
  /** 是否有投注项赔率发生变化 */
  get oddsChanged () {
    return (
      self.options.filter(
        ({ oddsStatus }) => oddsStatus !== 0
      ).length > 0
    )
  },
  get followStatus () {
    console.log('in store:', self.followTicket)
    if (!self.followTicket) {
      return -1
    }

    return self.followTicket.status
  }
})).actions(self => ({
  setLottery (lottery) {
    self.lottery = lottery
  },
  add (
    option,
    { options, ...market },
    { markets, ...match }
  ) {
    if (!self.lottery) {
      self.options.clear()
    }
    const index = self.options.findIndex(({ match: { matchId } }) => {
      return matchId === match.matchId
    })
    if (index !== -1) {
      self.options.splice(index, 1)
    }
    const cartOption = CartOption.create({
      ...option,
      market: Market.initial(market),
      match: Match.initial(match),
      maxBet: 999
    })

    self.options.push(cartOption)
    if (self.options.length === 1) {
      self.setPanelActive (true)
    }
  },
  delete (oid) {
    const index = self.options.findIndex(({ optionId}) => optionId === oid)
    if (index === -1) {
      return
    }
    self.options.splice(index, 1)
    if (self.options.length === 0) {
      self.setPanelActive (false)
    }
  },
  clear () {
    self.options.clear()
    self.betResult.clear()
    self.batchAmount = null
    self.comboAmount = null
    self.setPanelActive (false)
  },
  /** 根据点水结果更新数据 */
  updateByQuote (data) {
    if (!data || !data.options || !data.options.length) {
      return
    }

    const { options, extras } = data

    const overMaxies = options.filter(
      ({ status }) => status === -1
    ).map(
      ({ optionId }) => optionId
    )
    if (overMaxies.length > 0) {
      if (!isServer()) {
        const store = initializeStore()
        store.toast.warning('达到本场上限')
        self.clear()
      }
      return
    }

    options.forEach(nopt => {
      const index = self.options.findIndex(
        ({ optionId }) => optionId === nopt.optionId
      )
      if (index === -1) {
        return
      }

      // 如果为不可见不可投,则删除
      if (nopt.status === 0 || nopt.status === -2) {
        self.options.splice(index, 1)
        return
      }

      // 更新点水数据到store数据上
      self.options[index].update(nopt)
    })

    // 如果点水后无玩法,则提示投注项不可投并关闭
    if (!self.options.length) {
      self.clear()
      if (!isServer()) {
        // const store = initializeStore()
        // store.toast.warning('投注项暂不可投注')
      }
    }

    if (!extras || !extras.length) {
      return
    }

    const cinfo = extras.find(({ betN }) => betN === self.options.length)
    self.comboInfo = cinfo
  },
  setPanelActive (active) {
    self.panelActive = active
    document.body.style.overflowY = active ? 'hidden' : 'auto'
    if (active) {
      if (self.options.length === 1) {
        self.setInputing(0)
      }
    } else {
      self.setInputing(null)
    }
  },
  setInputing (index) {
    if (
      index !== null
      &&
      self.options[index]
      &&
      self.options[index].status !== 1) {
      return
    }
    self.inputing = index
  },
  setAmount (amount) {
    if (self.inputing === null) {
      return
    }
    // -1 批量单式金额
    if (self.inputing === -1) {
      self.batchAmount = amount
      self.options.forEach(opt => {
        opt.setAmount(amount)
      })
      return
    }
    // 串关金额
    if (self.inputing === -2) {
      self.comboAmount = amount
      return
    }
    self.options[self.inputing].setAmount(amount)
  },
  resetOddsChange () {
    self.options.forEach(o => o.resetOddsChange())
  },
  setBetResult (result) {
    if (!result || !result.length) {
      self.betResult.clear()
      return
    }

    result.forEach(item => {
      self.betResult.push(BetResult.create({
        ...item,
        bets: item.bets[0]
      }))
    })
  },
  setFollowTicket (ticket) {
    self.followTicket = ticket
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
          option.setStatus(opt.bst)
          option.setOdds(opt.odds)
        }
      })
    })
  },
  // nt5 整场拉盘, 删除对应投注项
  onMatchUnavailable (event) {
    const index = self.options.findIndex(
      ({ match }) => match.matchId = event.data.mid
    )
    if (index > 0) {
      self.options.splice(index, 1)
    }
  },
  // nt100 注单状态发生变化
  onOrderStateChange (event) {
    const changeResult = event.data
    // 跟单结果更新
    if (
      self.followTicket
      &&
      self.followTicket.ticketId === changeResult.ticketId
    ) {
      self.setFollowTicket({
        ...self.followTicket,
        status: changeResult.errorCode,
        msg: (
          changeResult.errorCode !== 200
          ? '跟单出错,请稍后再试'
          : ''
        )
      })
      console.warn('跟单出错:', changeResult)
      return
    }

    if (!self.betResult.length) {
      return
    }

    // 投注结果更新
    const result = self.betResult.find(
      ({ ticketId }) => changeResult.ticketId === ticketId
    )

    // 更新对应订单状态
    result.updateResult({
      status: changeResult.errorCode,
      msg: changeResult.errorMsg
    })

    if (changeResult.errorCode !== 200) {
      const store = initializeStore()
      if (store.member.isLoged) {
        console.log('还原金额')
      }
    }
  },
  /** 推送事件 */
  onDataChange (event) {
    if(!isAlive(self)) {
      return
    }

    // 注单变化
    if (event.nt === 100) {
      self.onOrderStateChange(event)
    }
    // 如果已经投注成功,则只判断注单变化
    if (!self.betResult) {
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
  }
}))

export default {
  type,
  initial: () => type.create({ followTicket: null })
}
