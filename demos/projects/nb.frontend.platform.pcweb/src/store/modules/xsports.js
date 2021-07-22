import { SportsList } from '@/config/constants';

const xsportsState = {
  sportsChoosing: false,
  activeSports: SportsList
    .filter(({ visible, available }) => visible && available)
    .map(({ sno }) => sno),
  matchListUpdateFlag: Date.now(),
  filterSno: null,
  filterMid: null,
  gameRulesVisible: false,
};
const mutations = {
  setSportsChoosing(state, choosing) {
    state.sportsChoosing = choosing;
  },
  setActiveSports(state, sports) {
    state.activeSports = sports;
    state.filterSno = null;
    state.filterMid = null;
  },
  refreshMatchListToken(state) {
    state.matchListUpdateFlag = Date.now();
  },
  updateFilterSno(state, sno) {
    state.filterSno = sno;
  },
  updateFilterMid(state, mid) {
    state.filterMid = mid;
  },
  showGameRule(state) {
    state.gameRulesVisible = true;
  },
  hideGameRule(state) {
    state.gameRulesVisible = false;
  },
};

const actions = {};

export default {
  namespaced: true,
  state: xsportsState,
  mutations,
  actions,
};
