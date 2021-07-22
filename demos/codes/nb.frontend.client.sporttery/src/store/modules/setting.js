import { StorageKey } from '@/config/constants';
import { saveToStorage } from '@/utils/StorageUtil';

import AppConfig from '@/config/business.config.js';

/**
 * 默认的setting数据
 */
const settingState = AppConfig.setting;
const mutations = {
  updateSetting(state, { key, value }) {
    state[key] = value;
    saveToStorage(StorageKey.SETTING_KEY, state);
  },
};

const actions = {};

export default {
  namespaced: true,
  state: settingState,
  mutations,
  actions,
};
