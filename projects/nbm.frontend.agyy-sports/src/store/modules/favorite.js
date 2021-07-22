import { types } from 'mobx-state-tree'

const type = types.model(
  'Favorite',
  {
    /** 收藏的比赛列表 */
    matchs: types.array(types.string),
    /** 收藏的联赛列表 */
    tours: types.array(types.string),
    /** 收藏数量 */
    counts: 0,
  }
).actions(self => ({
  /** 批量设置收藏id列表 */
  setFavs (list) {
    if (!list || !list.length) {
      return
    }

    list.forEach(item => {
      if (item.favType === 2) {
        self.tours.push(item.objId)
      } else {
        self.matchs.push(item.objId)
      }
    })
  },
  /** 添加收藏id */
  addFav (id, type) {
    if (type === 2) {
      self.tours.push(id)
    } else {
      self.matchs.push(id)
    }
    // self.counts = self.counts + 1
  },
  /** 取消收藏 */
  cancelFav (id, type) {
    const list = type === 2 ? self.tours : self.matchs
    const index = list.indexOf(id)
    if (index !== -1) {
      list.splice(index, 1)
    }
    // self.counts = Math.max(self.counts - 1, 0)
  },
  /** 设置收藏数量 */
  setCounts(counts) {
    self.counts = counts
  },
  /** 清空收藏 */
  clear () {
    self.tours.clear()
    self.matchs.clear()
    self.counts = 0
  }
}))

export default {
  type,
  initial: () => type.create({})
}
