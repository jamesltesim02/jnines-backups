import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import setting from './modules/setting';
import bet from './modules/bet';
import payment from './modules/payment';
import query from './modules/query';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    setting,
    bet,
    payment,
    query,
  },
});

export default store;
