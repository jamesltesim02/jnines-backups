import  { types } from 'mobx-state-tree'

const type = types.model(
  'Member',
  {
    token: types.maybeNull(types.string),
    isLoged: types.boolean,
    betId: types.maybeNull(types.string),
    memberInfo: types.frozen()
  }
).actions(self => ({
  setToken (token) {
    self.token = token
    self.isLoged = !!token
  },
  setBetId (betId) {
    self.betId = betId
  },
  setMemberInfo (memberInfo) {
    if (!memberInfo) {
      self.memberInfo = null
      self.betId = null
      return
    }

    if (!self.memberInfo) {
      self.memberInfo = memberInfo
    }
  },
  updateMemberInfo (memberInfo) {
    self.memberInfo = {
      ...self.memberInfo,
      ...memberInfo
    }
  }
}))

export default {
  type,
  initial: () => type.create({
    token: null,
    isLoged: false,
    memberInfo: null
  })
}
