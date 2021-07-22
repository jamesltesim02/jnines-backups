import store from '@/store';
import {
  getAppInit,
  getCustomer,
  getAmountRefresh,
} from '@/api/portalAgyy';

const agyyState = {
  routerIndex: -1,
  history: [],
  router: null,
  routerParam: null,
  portalConf: {},
  payresult: null,
  reportIndex: 0,
  msgCheckTime: 0,
  bankCardType: false,
  bankCardAct: false,
  noBankAlert: false,
  bankInputFlag: false,
};

const getters = {
  mainPath(state) {
    if (!state.router) {
      return null;
    }
    return `/${state.router.split('/')[1]}`;
  },
  subPath(state) {
    if (!state.router) {
      return null;
    }
    const sp = state.router.split('/')[2];
    return sp ? `/${sp}` : sp;
  },
};

const mutations = {
  setPortalConf(state, portalConf) {
    state.portalConf = portalConf;
  },
  pushRouter(state, router) {
    let path = router;
    let param = null;

    if (typeof router !== 'string') {
      path = router.path; // eslint-disable-line prefer-destructuring
      param = router.param; // eslint-disable-line prefer-destructuring
    }
    // 如果已经登陆则转到member
    if (store.state.app.isLoged) {
      if (/^\/sign(in|up)/i.test(path)) {
        path = path.replace(/^\/sign(in|up)/i, '/member');
      }
    } else if (/^\/member/i.test(path)) {
      path = '/signin';
    }

    // 如果路由的位置在中间则清空尾部
    if (state.routerIndex < state.history.length - 1) {
      state.history.splice(state.routerIndex + 1, state.history.length - 1);
    }
    state.history.push(path);
    state.routerParam = param;
    state.routerIndex = state.history.length - 1;
    state.router = path;
  },
  goRouter(state, index) {
    if (state.history.length === 0) {
      return;
    }
    let finalIndex = state.routerIndex + index;
    finalIndex = Math.min(Math.max(0, finalIndex), state.history.length - 1);
    state.router = state.history[finalIndex];
    state.routerIndex = finalIndex;
  },
  hide(state) {
    state.routerIndex = -1;
    state.history = [];
    state.router = null;
  },
  setPayresult(state, payresult) {
    state.payresult = payresult;
  },
  setReportIndex(state, num) {
    state.reportIndex = /^\d$/.test(num) ? +num : 0;
  },
  setMsgCheckTime(state) {
    state.msgCheckTime = Date.now();
  },
  setBankCardType(state, type) {
    state.bankCardType = !!type;
  },
  setBankCardAct(state) {
    state.bankCardAct = !state.bankCardAct;
  },
  setNoBankAlert(state, status) {
    state.noBankAlert = !!status;
  },
  setBankInputFlag(state) {
    state.bankInputFlag = !state.bankInputFlag;
  },
};

const actions = {
  async init({ commit }) {
    const portalConf = await getAppInit();
    commit('setPortalConf', portalConf);
  },
  async reloadUserinfo({ rootState, commit }) {
    try {
      const [customer, balance] = await Promise.all([
        getCustomer(),
        getAmountRefresh(),
      ]);
      commit(
        'app/updateUserinfo',
        {
          ...rootState.app.userinfo,
          phone: customer.phone,
          memberLevel: customer.userLevel,
          balance: +balance[1] || 0,
        },
        { root: true },
      );
    } catch (e) {
      console.log('load balance fail:', e);
    }
  },
  async reloadBalance({ rootState, commit }) {
    const balance = await getAmountRefresh();
    commit(
      'app/updateUserinfo', {
        ...rootState.app.userinfo,
        balance: +balance[1] || 0,
      },
      { root: true },
    );
  },
};

export default {
  namespaced: true,
  state: agyyState,
  getters,
  mutations,
  actions,
};
