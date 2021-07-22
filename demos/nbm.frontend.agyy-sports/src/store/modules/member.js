import  { types } from 'mobx-state-tree'
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/storage-utils'

const TOKEN_STORAGE_KEY = 'agyy-betwidget-store-member-token'

const type = types.model(
  'Member',
  {
    tempToken: types.maybeNull(types.string),
    isLoged: types.boolean,
    memberInfo: types.frozen(),
    /** 新订单数量(此处只统计投注成功订单) */
    newOrder: 0,
  }
).actions(self => ({
  setTempToken (token) {
    if (token === 'UNSIGNED') {
      removeFromStorage(TOKEN_STORAGE_KEY)
    } else {
      self.tempToken = token
    }
  },
  setMemberInfo (memberInfo) {
    if (!memberInfo) {
      self.memberInfo = null
      self.isLoged = false
      removeFromStorage(TOKEN_STORAGE_KEY)
      return
    }

    self.isLoged = true
    self.memberInfo = {
      ...memberInfo,
      balance: Number(memberInfo.balance).toFixed(2)
    }
    saveToStorage(TOKEN_STORAGE_KEY, memberInfo.token)
  },
  setBalance (balance) {
    if (!self.isLoged) {
      return
    }

    self.memberInfo = {
      ...self.memberInfo,
      balance: Number(balance).toFixed(2)
    }
  },
  updateMemberInfo (memberInfo) {
    self.memberInfo = {
      ...self.memberInfo,
      ...memberInfo,
      balance: Number(memberInfo.balance).toFixed(2)
    }
  },
  /** 设置新订单数量 */
  setNewOrder (orderCount) {
    self.newOrder = orderCount
  },
}))

export default {
  type,
  initial: () => {
    // 获取参数或缓存中的token
    const token = (
      new URLSearchParams(
        window.location.search
      ).get('token')
      ||
      loadFromStorage(TOKEN_STORAGE_KEY)
    )

    return type.create({
      tempToken: token || null,
      token: null,
      isLoged: false,
      memberInfo: null
    })
  }
}
