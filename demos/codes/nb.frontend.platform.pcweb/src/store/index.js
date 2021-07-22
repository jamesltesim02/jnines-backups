import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import match from './modules/match';
import bet from './modules/bet';
import setting from './modules/setting';
import agyy from './modules/agyy';
import xsports from './modules/xsports';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    match,
    bet,
    setting,
    agyy,
    xsports,
  },
});
