import { types } from 'mobx-state-tree'

import {
  saveToStorage,
  loadFromStorage
} from '../../utils/storage-utils'

const GROUP_CACHE_KEY = 'hc-hnlottery-group'

/**
 * 将接口返回赔率数据进行格式化
 *
 * @param {object} param0 将要转换的赔率数据
 */
const prepareOdds = ({ games, total }) => {
  const odds = Object.fromEntries(
    games.map(
      g => [
        g.gameType,
        {
          odds: g.odds,
          matchReturn: g.maxPayAmount
        }
      ]
    )
  )

  odds[31] = Object.fromEntries(
    total.map(
      i => [
        i.gameType,
        {
          odds: i.odds,
          matchReturn: i.maxPayAmount
        }
      ]
    )
  )

  return odds
}

/** 默认彩票类型: 七星彩 */
const DEFUALT_GROUP = 1

/**
 * 数字彩相关
 */
const type = types.model(
  'Qxc',
  {
    /** 彩票类型: 1 七星彩 2 排列五 默认为1 */
    group: DEFUALT_GROUP,
    /** 期号 */
    issue: types.maybeNull(types.string),
    /** 截止时间 */
    offTime: types.maybeNull(types.number),
    /** 赔率 */
    odds: types.maybeNull(types.frozen()),
    /** 最新更新时间 */
    updateTime: 0,
    /** 开奖历史 */
    history: types.array(types.frozen()),
  }
).views(self => ({
  /** 最近5期 */
  get top5 () {
    return self.history.slice(0, 5)
  },
})).actions(self => ({
  /** 设置数字彩初始化信息 */
  setInfo (info) {
    self.issue = info.issueNum
    self.offTime = new Date(info.endTime).getTime()
    self.odds = prepareOdds(info.allOdds)
    self.updateTime = Date.now()
  },
  /** 设置历史开讲记录数据 */
  setHistory (history) {
    self.history = history
  },
  /** 设置彩票类型 */
  setGroup (group) {
    if (self.group === group) {
      return
    }

    self.group = group
    saveToStorage(
      GROUP_CACHE_KEY,
      group
    )
  }
}))

export default {
  type,
  initial: () => type.create({
    group: loadFromStorage(GROUP_CACHE_KEY, DEFUALT_GROUP)
  })
}
