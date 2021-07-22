import  { types } from 'mobx-state-tree'
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/storage-utils'

const TOKEN_STORAGE_KEY = 'pkw-store-member-token'

const type = types.model(
  'Member',
  {
    tempToken: types.maybeNull(types.string),
    isLoged: types.boolean,
    memberInfo: types.frozen()
  }
).actions(self => ({
  setMemberInfo (memberInfo) {
    if (!memberInfo) {
      self.memberInfo = null
      self.isLoged = false
      removeFromStorage(TOKEN_STORAGE_KEY)
      return
    }

    self.isLoged = true
    self.memberInfo = memberInfo
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
      ...memberInfo
    }
  },
}))

export default {
  type,
  initial: () => {
    const params = new URLSearchParams(window.location.search)

    // 获取参数或缓存中的token
    const token = (
      params.get('token')
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
