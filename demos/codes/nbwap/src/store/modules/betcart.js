const state = {
  bettingList: []
}

const mutations = {
  toggleBetting (state, {option, match, game}) {
    let index = state.bettingList.findIndex(o => o.oid === option.oid)

    if (index > -1) {
      state.bettingList.splice(index, 1)
      return
    }

    if(state.bettingList.length >= 15) {
      // throw new E
    }

    state.bettingList.push({
      mid: match.mid,
      htn: match.htn,
      atn: match.atn,
      stm: match.stm,
      bstage: game.bstage,
      gno: match.gno,
      gtp: match.gtp,
      ovalue: game.ovalue,
      bcontent: game.bcontent,
      ...option
    })
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
