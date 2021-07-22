import { findportaltou } from '@/api/pull';

const matchState = {
  sno: null,
  stateList: [
    // 滚球 grounderNum
    {
      value: 2,
      count: '',
    },
    // 今日 todayNum
    {
      value: 1,
      count: '',
    },
    // 早盘 morningPlateNum
    {
      value: 0,
      count: '',
    },
  ],
  state: null,
  hotTours: [],
  tourid: null,
  detailOptionRefreshToken: Date.now(),
};
const mutations = {
  resetDefault(state) {
    state.sno = null;
    state.state = null;
    state.tourid = null;
  },
  setSno(state, sno) {
    state.sno = sno;
  },
  setSnoAndState(state, { sno, newState }) {
    state.sno = sno;
    state.state = newState;
  },
  setSnoAndTourid(state, { sno, tourid }) {
    state.sno = sno;
    state.tourid = tourid;
  },
  setTourid(state, tourid) {
    state.tourid = tourid;
  },
  setStateCounts(
    state,
    stateCounts,
  ) {
    stateCounts = stateCounts || {
      grounderNum: '',
      todayNum: '',
      morningPlateNum: '',
    };

    state.stateList[0].count = stateCounts.grounderNum;
    state.stateList[1].count = stateCounts.todayNum;
    state.stateList[2].count = stateCounts.morningPlateNum;
  },
  setCurrentSport(state, { sno, stateCounts, newState }) {
    mutations.setSnoAndState(state, { sno, newState });
    mutations.setStateCounts(state, stateCounts);
  },
  setHotTours(state, hotTours) {
    state.hotTours = hotTours;
  },
  updateDetailOptionRefreshToken(state) {
    state.detailOptionRefreshToken = Date.now();
  },
};
const actions = {
  async loadHotTours({ commit }) {
    const tours = await findportaltou();
    commit('setHotTours', tours);
  },
};

export default {
  namespaced: true,
  state: matchState,
  mutations,
  actions,
};
