import { types, isAlive } from 'mobx-state-tree'

import MatchItem from './match-item'

/**
 * 比赛列表store
 */
const type = types.model(
  'MatchList',
  {
    list: types.array(MatchItem.type)
  }
).actions(self => ({
  /**
   * 添加单场比赛到列表
   * @param {object} match 比赛信息
   */
  add(match) {
    self.list.push(MatchItem.initial(match))
  },
  /**
   * 批量添加比赛到列表中
   *
   * @param {array} list 比赛列表
   */
  addBatch (list) {
    list.forEach(self.add)
  },
  /** 清空数据 */
  clear() {
    self.list.clear()
  },
  /**
   * 处理推送数据
   *
   * @param {object} event 推送消息
   */
  onDataChange (event) {
    // 获取列表中对应的比赛
    const matchIndex = self.list.findIndex(
      ({ matchId }) => matchId === event.data.mid
    )
    if (matchIndex === -1) {
      return
    }

    // 如果是比赛状态变为完场, 直接从当前列表中删除
    if (event.nt === 1 && event.data.nst === 3) {
      self.list.splice(matchIndex, 1)
      return
    }

    // 触发对应事件
    const eventMatch = self.list[matchIndex]

    if(isAlive(eventMatch)) {
      eventMatch.onDataChange(event)
    }
  }
}))

export default {
  type,
  initial: () => type.create({})
}
