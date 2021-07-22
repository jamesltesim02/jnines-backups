import { types, isAlive } from 'mobx-state-tree'

import Match from './submodules/match-item'

/** 比赛详情 */
const type = types.model(
  'Detail',
  {
    overed: false,
    match: types.maybeNull(Match.type)
  }
).views(self => ({
  /** 推送消息 */
  get pushData () {
    return self.match ? ([
      {
        sportId: self.match.sportId,
        marketType: [-1],
        marketStage: -1,
        matchIds: [self.match.matchId]
      }
    ]) : []
  }
})).actions(self => ({
  setData ({ match }) {
    self.overed = false
    self.match = Match.initial(match)
  },
  /**
   * 推送消息处理
   *
   * @param {object} event 推送过来的消息
   */
  onDataChange (event) {
    // 如果当前没有比赛,则忽略
    if (!self.match) {
      return
    }
    // 比赛详情忽略主盘变化事件
    if (event.nt === 4) {
      return
    }
    // 如果不是当前比赛则忽略
    if (self.match.matchId !== event.data.mid) {
      return
    }
    // 如果是完场,则设置为已完场
    if (event.nt == 1 && event.data.nst === 3) {
      self.overed = true
      return
    }
    if (isAlive(self.match)) {
      self.match.onDataChange(event)
    }
  }
}))

export default {
  type,
  initial: () => type.create({})
}