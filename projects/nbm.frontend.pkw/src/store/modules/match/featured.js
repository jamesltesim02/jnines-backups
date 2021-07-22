import { types } from 'mobx-state-tree'

/** 一组体育项相关比赛 */
const type = types.model(
  'Featured',
  {}
)

export default {
  type,
  initial: () => type.create({})
}