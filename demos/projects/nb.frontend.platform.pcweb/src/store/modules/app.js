import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { reconnect } from '@/plugins/Pusher';

const cachedUserinfo = loadFromStorage(StorageKey.CASINO_USER_KEY, null);
const cachedBettingMode = loadFromStorage(StorageKey.BETTING_MODE_KEY, window.NBConfig.BETTING_MODE || 2);
const cachedBettingStyle = loadFromStorage(StorageKey.BETTING_STYLE_KEY, window.NBConfig.BETTING_STYLE || 0);

const appState = {
  contentHeight: 0,
  isLoged: !!(cachedUserinfo && cachedUserinfo.token),
  userinfo: cachedUserinfo || {},
  bettingMode: cachedBettingMode,
  bettingStyle: cachedBettingStyle,
  frontId: null,
  // 商户域名
  portalDomain: null,
  nbFilterClass: '',
  nbFilterTimer: '',
  theme: loadFromStorage(StorageKey.THEME_KEY, window.NBConfig.THEME),
  toast: null,
  // 最后一次页面地址
  lastLocation: '',
};

const mutations = {
  /**
   * 更新frontId
   */
  updateFrontId(state, frontId) {
    state.frontId = frontId;
  },
  /**
   * 更新商户域名
   */
  updatePortalDomain(state, portalDomain) {
    state.portalDomain = portalDomain;
  },
  updateTheme(state, theme) {
    state.theme = theme;
    saveToStorage(StorageKey.THEME_KEY, theme);
  },
  setContentHeight(state, height) {
    state.contentHeight = height;
  },
  getUserInfo(state) {
    state.userinfo = loadFromStorage(StorageKey.CASINO_USER_KEY, null);
    state.isLoged = !!(state.userinfo && state.userinfo.token);
  },
  setUserinfo(state, userinfo) {
    mutations.updateUserinfo(state, userinfo);
    reconnect();
  },
  updateUserinfo(state, userinfo) {
    state.userinfo = userinfo;
    state.isLoged = !!(state.userinfo && state.userinfo.token);
    saveToStorage(StorageKey.CASINO_USER_KEY, userinfo || null);
  },
  updateBettingMode(state, mode) {
    state.bettingMode = mode || 2;
    saveToStorage(StorageKey.BETTING_MODE_KEY, mode || 2);
  },
  updateBettingStyle(state, mode) {
    state.bettingStyle = mode || 0;
    saveToStorage(StorageKey.BETTING_STYLE_KEY, mode || 0);
  },
  setNbFilterClass(state, { time, blur }) {
    state.nbFilterTimer = time || state.nbFilterTimer || '';
    setTimeout(() => { state.nbFilterClass = blur || ''; }, 0);
  },
  updateLastLocation(state, lastLocation) {
    state.lastLocation = lastLocation;
  },
  // 更新toast
  toast(state, toast) {
    if (typeof toast === 'string') {
      toast = {
        msg: toast,
      };
    }
    state.toast = toast;
  },
};

const actions = { };

export default {
  namespaced: true,
  state: appState,
  mutations,
  actions,
};
