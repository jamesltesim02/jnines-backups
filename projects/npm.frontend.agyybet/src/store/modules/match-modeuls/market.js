import difference from 'lodash/difference'
import { types, isAlive } from 'mobx-state-tree'

import Option from './option'

/** 玩法信息 */
const type = types.model(
  'Market',
  {
    /** 玩法id */
    marketId: types.string,
    /** 比赛id */
    matchId: types.string,
    /** 玩法类型 */
    marketType: types.number,
    /** 玩法分组类别 */
    marketGroup: types.number,
    /** 玩法阶段 */
    marketStage: types.number,
    /** 球头 */
    // betBar: types.string,
    /** 排序 */
    orderNo: types.number,
    /** 玩法类别(标签) */
    marketCategory: types.number,
    /** 支持串关数(0: 不支持, 2: 至少2串1, 3: 至少3串1) */
    combo: 0,
    /** 是否为主盘 */
    // main: false,
    /** 投注项列表 */
    options: types.array(Option.type)
  }
).views(self => ({
  get size () {
    return self.options.length
  }
})).actions(self => ({
  /**
   * 添加option到列表
   * @param {object} option 投注项信息
   */
  addOption (option) {
    if (option.status === 0) {
      return
    }
    self.options.push(Option.initial(option))
  },
  addOptions ({options, betBar, main}) {
    if (!options || !options.length) {
      return
    }

    options.forEach(option => {
      self.addOption({
        ...option,
        main,
        betBar
      })
    })
  },
  /**
   * 赔率或状态变化事件
   * @param {object} emarket 更新的玩法信息
   */
  onOddsStatusChange (emarket) {
    emarket.ops.forEach(opt => {
      const idxInList = self.options.findIndex(({ optionId }) => optionId === opt.oid)
      // 如果列表中不存在option,则表示需要添加到列表
      if (idxInList === -1) {
        if (opt.bst !== 0) {
          self.addOption({
            optionId: opt.oid,
            betOption: opt.bop,
            betBar: emarket.betbar,
            main: false,
            odds: opt.odds,
            status: opt.bst,
            orderNo: opt.num
          })
        }
        return
      }

      // 不可见不可投,则从列表中删除
      if (opt.bst === 0) {
        self.options.splice(idxInList, 1)
        return
      }

      // 否则为状态或者赔率变化
      const option = self.options[idxInList]
      if (option && isAlive(option)) {
        option.onDataChange(opt.bst, opt.odds)
      }
    })
  },
  /**
   * 主盘变化
   * @param {object} emarket 玩法信息
   */
  onMainGameChange (emarket) {
    // 如果更新的option和现有的option一致,则不处理
    if (
      difference(
        emarket.ops.map(({ oid }) => oid),
        (self.options || []).map(({ optionId}) => optionId)
      ).length === 0
    ) {
      return
    }

    // 删除已有主盘
    if (self.options.length > 0) {
      for (let i = self.options.length - 1; i >= 0; i--) {
        const opt = self.options[i]
        if (opt.main) {
          self.options.splice(i, 1)
        }
      }
    }

    if (!emarket.ops || !emarket.ops.length) {
      return
    }

    console.log('new main option:', emarket)

    // 添加新主盘到玩法中
    emarket.ops.forEach(opt => {
      self.addOption({
        optionId: opt.oid,
        betOption: opt.bop,
        odds: opt.odds,
        betBar: emarket.betbar,
        main: true,
        status: 1
      })
    })
  }
}))

export default {
  type,
  initial: (market) => {
    const {
      options,
      ...marketInfo
    } = market
    if (!marketInfo.marketId) {
      return null
    }
    const instance = type.create(marketInfo)
    instance.addOptions(market)
    return instance
  }
}