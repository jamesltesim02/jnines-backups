const matchState = {
  detailOptionRefreshToken: Date.now(),
};
const mutations = {
  updateDetailOptionRefreshToken(state) {
    state.detailOptionRefreshToken = Date.now();
  },
};

const actions = {};

export default {
  namespaced: true,
  state: matchState,
  mutations,
  actions,
};
