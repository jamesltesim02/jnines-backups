/**
 * 默认的portal数据
 */
const portalState = {
  tokenRefreshTime: Date.now(),
  b06Siteswither: false,
};

const mutations = {
  updateToken(state) {
    state.tokenRefreshTime = Date.now();
  },
  updateSiteswitcher(state, visible) {
    state.b06Siteswither = visible;
  },
};

const actions = {};

export default {
  namespaced: true,
  state: portalState,
  mutations,
  actions,
};
