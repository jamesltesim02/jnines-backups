import appConfig from '@/config/business.config';
import { StorageKey, AppModes, PortalAgyyConfig } from '@/config/constants';
import { loadFromStorage, saveToStorage, getCacheData } from '@/utils/StorageUtil';
import { getBalance } from '@/api/casino';
import { reconnect } from '@/utils/PushUtil';
import { agGetBalance, getCustomer, transferToGame } from '@/api/portalAgyy';
import { setTheme } from '@/utils/app/AppUtils';

const cachedUserinfo = loadFromStorage(StorageKey.CASINO_USER_KEY, null);
const cachedTheme = loadFromStorage(StorageKey.USER_THEME_KEY, window.NBConfig.THEME);
const cachedMatchListStyle = loadFromStorage(StorageKey.MATCH_LIST_STYLE_KEY, window.NBConfig.MATCH_LIST_STYLE);
const cachedBettingMode = loadFromStorage(StorageKey.BETTING_MODE_KEY, window.NBConfig.BETTING_MODE);

const { APP_MODE } = window.NBConfig;
const isLite = APP_MODE === AppModes.STANDALONE_LITE;

const { body } = document;

// 设置默认皮肤
setTheme(cachedTheme);
body.className = cachedTheme;

const appState = {
  isLoged: !!(cachedUserinfo && cachedUserinfo.token),
  userinfo: cachedUserinfo || {},
  // 0 单式, 1 串关    默认 0
  multType: 0,
  // 皮肤设定 white 白色, black 黑色
  theme: cachedTheme,
  // 前端标志id
  frontId: null,
  /**
   * 赛程列表展示样式
   * 1: 宽松两胜平负盘口样式
   * 2: 紧凑两胜平负盘口样式
   * 3: 紧凑但盘口样式
   * 4: 宽松让分大和小盘口样式
   */
  matchListStyle: cachedMatchListStyle,
  /**
   * 投注模式
   * 1: 小白模式
   * 2: 专家模式
   */
  bettingMode: cachedBettingMode,
  // 商户配置信息(从pull接口查询的)
  portalInfo: null,
  // 商户参数信息(从前端接入url中获取的参数)
  portalParams: null,
  // 是否显示tabBar, 用于页面六下面空白，为带rem的高度文本
  tabHeight: '0',
  toastStr: '',
  bankObj: null,
  jumpObj: null,
  jumpStatus: false,
  singleBetStatus: false,
  // 余额加载中
  balanceLoading: false,
  isLite,
  // toast message
  toast: null,
  // 最后一次页面地址
  lastLocation: '',
  msgCheckTime: 0,
  cryptKey: PortalAgyyConfig.CRYPT_KEY,
  agRegType: PortalAgyyConfig.REGISTER_TYPE,
};

const mutations = {
  setCryptKey(state, key) {
    state.cryptKey = key || '';
  },
  setAGRegType(state, type) {
    state.agRegType = /^[23]$/.test(type) ? type : 2;
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
    saveToStorage(StorageKey.CASINO_USER_KEY, userinfo || null);
    mutations.getUserInfo(state);
  },
  updateMultType(state, type) {
    state.multType = [0, 1].includes(type) ? type : 0;
  },
  toggleTheme(state) {
    state.theme = 'blackwhite'.replace(state.theme, '');
    setTheme(state.theme);
    body.className = state.theme;
    saveToStorage(StorageKey.USER_THEME_KEY, state.theme);
  },
  updatePortalInfo(state, portalInfo) {
    state.portalInfo = portalInfo;
  },
  setTabHeight(state, height) {
    state.tabHeight = height || '0';
  },
  updateToast(state, str) {
    state.toastStr = str || '';
    mutations.getUserInfo(state);
  },
  setBankObject(state, obj) {
    let nObj = JSON.parse(JSON.stringify(state.bankObj));
    if (obj) {
      [nObj.step, nObj.vert] = [obj.step || 0, obj.vert !== undefined ? obj.vert : !!nObj.vert];
    } else {
      nObj = { vert: false, step: 0 };
    }
    state.bankObj = nObj;
  },
  setJumpObject(state, obj) {
    state.jumpObj = obj && typeof obj === 'object' && obj.constructor !== Array ? obj : null;
  },
  setJumpStatus(state, status) {
    state.jumpStatus = !!status;
  },
  setSingleBetStatus(state, status) {
    state.singleBetStatus = !!status;
  },
  /**
   * 更新frontId
   */
  updateFrontId(state, frontId) {
    state.frontId = frontId;
  },
  /**
   * 更新商户参数信息
   */
  updatePortalParams(state, params) {
    state.portalParams = params;
  },
  updateMatchListStyle(state, style) {
    state.matchListStyle = style;
    saveToStorage(StorageKey.MATCH_LIST_STYLE_KEY, style);
  },
  updateBettingMode(state, mode) {
    state.bettingMode = mode;
    state.multType = 0;
    saveToStorage(StorageKey.BETTING_MODE_KEY, mode);
  },
  updateBalanceLoading(state, isLoading) {
    state.balanceLoading = isLoading;
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
  updateLastLocation(state, lastLocation) {
    state.lastLocation = lastLocation;
  },
  setMsgCheckTime(state) {
    state.msgCheckTime = Date.now();
  },
};

const actions = {
  async reloadBalance({ state, commit }, flag) {
    commit('updateBalanceLoading', true);
    let data = null;
    if (isLite) {
      data = await agGetBalance();
    } else {
      data = {
        totalBalance: await getBalance(),
      };
    }
    if (state.userinfo && state.userinfo.token) {
      if (data.localBalance !== undefined && (data.localBalance > 1 || flag)) {
        transferToGame(!flag);
      }
      commit('updateUserinfo', {
        ...state.userinfo,
        balance: data.totalBalance,
      });
    }
    commit('updateBalanceLoading', false);
  },
  async agRealodUserinfo({ state, commit }) {
    const agUserinfo = await getCacheData(
      StorageKey.AG_USERINFO_CACHE_KEY,
      appConfig.agUserCacheTime,
      getCustomer,
    );
    if (state.userinfo && state.userinfo.token) {
      commit('updateUserinfo', {
        ...state.userinfo,
        phone: agUserinfo.phone,
        memberLevel: agUserinfo.userLevel,
      });
    }
  },
};

export default {
  namespaced: true,
  state: appState,
  mutations,
  actions,
};
