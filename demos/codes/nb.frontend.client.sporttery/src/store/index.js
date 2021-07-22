import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import portal from './modules/portal';
import setting from './modules/setting';
import bet from './modules/bet';
import payment from './modules/payment';
import query from './modules/query';
import match from './modules/match';
import xsports from './modules/xsports';
import member from './modules/member';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    portal,
    setting,
    bet,
    payment,
    query,
    match,
    xsports,
    member,
  },
});

export default store;
