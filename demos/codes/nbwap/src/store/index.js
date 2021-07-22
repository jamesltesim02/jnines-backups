import Vue from 'vue'
import Vuex from 'vuex'
import matchs from './modules/matchs'
import betcart from './modules/betcart'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    matchs,
    betcart
  }
})
