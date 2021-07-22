import  { types } from 'mobx-state-tree'
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/storage-utils'

const TOKEN_STORAGE_KEY = 'agyybet-store-member-token'

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
      balance
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
