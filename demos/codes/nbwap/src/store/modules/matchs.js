import api from '@/api/matchs'

const {ghomematch, gmatch} = api

const state = {
  homeMatchs: {},
  footballMatchs: {}
}

const mutations = {
  updateHomeMatchs (state, data) {
    state.matchs = data
  },
  updateFootballMatchs (state, data) {
    state.footballMatchs = data.sports[0]
  }
}

const actions = {
  async queryHome ({commit}) {
    let data = await ghomematch({
      'lang': 'zh-cn',
      'hot': '1',
      'gtp': '16%2C18',
      'level': '2',
      'bstage': '0%2C1000%2C2000',
      'bcontent': '1',
      'sortBy': 'sortByTime'
    })

    commit('updateHomeMatchs', data)
  },
  async queryFooball ({commit}) {
    let data = await gmatch({
      'lang': 'zh-cn',
      'level': '2',
      'sno': '10',
      'ttp': '',
      'gtp': '1',
      'rid': '',
      'groupNo': '',
      'bcontent': '1',
      'click_more': 'false',
      'sortBy': 'sortByTime',
      'page': '1',
      'bstage': '0',
      'selected_ttp_index': '0',
      'selected_gtp_index': '0',
      'limit': '20',
      'stage': '-100',
      'sportType_index': '0',
      'sendCallback': ''
    })

    commit('updateFootballMatchs', data)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
