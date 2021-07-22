import { types } from 'mobx-state-tree'

import MatchItem from './match-item'

/** 联赛信息 */
const type = types.model(
  'Tour',
  {
    id: types.string,
    name: types.string,
    logo: types.maybeNull(types.string),
    sportId: types.number,
    matchs: types.array(MatchItem.type)
  }
).views(self => ({
  /** 推送上行数据 */
  get pushData () {
    return self.matchs.map(
      ({
        sportId,
        matchId,
      }) => ({
        sportId,
        // 玩法所在比赛阶段, 列表都传全场玩法
        marketStage: 0,
        matchIds: [ matchId ],
      })
    )
  },
  /** 比赛的id列表 */
  get mids () {
    return self.matchs.map(({ matchId }) => matchId)
  }
})).actions(self => ({
  addMatch (match) {
    self.matchs.push(MatchItem.initial(match))
  }
}))

export default {
  type,
  initial: data => type.create(data)
}