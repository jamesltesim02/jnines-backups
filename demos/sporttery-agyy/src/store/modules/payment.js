import appConfig from '@/config/business.config';
import { loadFromStorage, saveToStorage, getCacheData } from '@/utils/StorageUtil';
import { StorageKey } from '@/config/constants';
import { getPayChannel } from '@/api/portalAgyy';

const paymentState = {
  channels: {},
  types: [],
  rules: null,
  popInfo: null,
  loading: false,
  lastType: loadFromStorage(StorageKey.AG_LAST_PAYMENT_TYPE_KEY, null),
  portalUrl: null,
};

const mutations = {
  updatePaymentinfo(state, paymentInfo) {
    state.channels = paymentInfo.channels;
    state.types = paymentInfo.types;
    state.rules = paymentInfo.rules;
  },
  updatePopInfo(state, popInfo) {
    state.popInfo = popInfo;
    if (popInfo) {
      state.lastType = popInfo.type;
      saveToStorage(StorageKey.AG_LAST_PAYMENT_TYPE_KEY, popInfo.type);
    }
  },
  updatePortalUrl(state, portalUrl) {
    state.portalUrl = portalUrl;
  },
  updateLoading(state, loading) {
    state.loading = loading;
  },
};

const actions = {
  async reloadPaymentInfo({ commit }) {
    try {
      commit('updateLoading', true);
      const paymentInfo = await getCacheData(
        StorageKey.AG_PAYMENT_INFO_KEY,
        appConfig.agPaymentInfoCacheTime,
        getPayChannel,
      );
      commit('updatePaymentinfo', paymentInfo);
    } finally {
      commit('updateLoading', false);
    }
  },
};

export default {
  namespaced: true,
  state: paymentState,
  mutations,
  actions,
};
