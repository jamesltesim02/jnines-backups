import { SportsList } from '@/config/constants';

const xsportsState = {
  finishedDetail: null,
  activeSports: SportsList
    .filter(({ visible, available }) => visible && available)
    .map(({ sno }) => sno),
  matchFilter: {
    all: true,
    sports: [],
    tours: [],
  },
};
const mutations = {
  setFinishedDetail(state, finishedDetail) {
    state.finishedDetail = finishedDetail;
  },
  toggleActiveSports({ activeSports }, sport) {
    if (!activeSports.includes(sport)) {
      activeSports.push(sport);
      return;
    }
    if (activeSports.length <= 1) {
      return;
    }
    activeSports.splice(
      activeSports.findIndex(sno => sno === sport),
      1,
    );
  },
  setActiveSports(state, sports) {
    state.activeSports = sports;
  },
  setMatchFilter(state, filter) {
    state.matchFilter = {
      all: true,
      sports: [],
      tours: [],
      ...filter,
    };
  },
};

const actions = {};

export default {
  namespaced: true,
  state: xsportsState,
  mutations,
  actions,
};
