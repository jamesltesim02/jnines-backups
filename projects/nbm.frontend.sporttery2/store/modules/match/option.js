import { types, isAlive } from 'mobx-state-tree'

/** 投注项信息 */
const type = types.model(
  'Option',
  {
    /** 投注项id */
    optionId: types.string,
    /** 投注项标识 */
    betOption: types.string,
    /** 玩法盘口 */
    betBar: types.maybeNull(types.string),
    /** 是否为主盘 */
    main: false,
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
    /** 排序依据字段 */
    orderNo: 0,
    /**
     * 赔率变化状态  
     * 小于0: 赔率降低
     * 0: 赔率没有变化
     * 大于0: 赔率升高
     */
    oddsStatus: 0,
    /** 最高投注额 */
    maxBet: 0,
    /** 最高返还额 */
    maxReturn: 0,
    /** 最低投注额 */
    minBet: 10,
  }
).actions(self => ({
  /**
   * 更新赔率
   * @param {number} odds 新赔率
   */
  setOdds(odds) {
    if (isAlive(self)) {
      self.oddsStatus = odds - self.odds
      self.odds = odds
    }
  },
  /**
   * 更新投注项信息
   * @param {number} status 投注项状态
   * @param {number} odds 新赔率
   */
  onDataChange (status, odds) {
    if(!isAlive(self)) {
      return
    }
    self.status = status
    self.setOdds(odds)
    // 1.5秒后状态复原, 不再闪烁
    setTimeout(() => {
      if (isAlive(self)) {
        self.setOdds(odds)
      }
    }, 1500)
  }
}))

export default {
  type,
  initial: option => type.create(option)
}