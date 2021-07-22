import store from '@/store';
import appConfig from '@/config/business.config';
import { StorageKey, AppModes, PortalAgyyConfig } from '@/config/constants';
import { loadFromStorage, saveToStorage, getCacheData } from '@/utils/StorageUtil';
import { reconnect } from '@/utils/PushUtil';
import { portalTrans } from '@/api/portalAxios';
import { setTheme } from '@/utils/app/AppUtils';
import { getAmountRefresh, getCustomer, transferToGame } from '@/api/portalAgyy';
import { toPoralUrlByKey } from '@/utils/PortalUtils';

const cachedVideoLock = loadFromStorage(StorageKey.VIDEO_LOCK_KEY, true);
const cachedUserinfo = loadFromStorage(StorageKey.CASINO_USER_KEY, null);
const scanUserInfo = loadFromStorage(StorageKey.SCAN_CODE_USER_KEY, null);
const cachedTheme = loadFromStorage(StorageKey.USER_THEME_KEY, window.NBConfig.THEME);
const cachedUserTeach = loadFromStorage(StorageKey.USER_TEACH_KEY, [false, false, false, false]);
const cachedMatchListStyle = loadFromStorage(StorageKey.MATCH_LIST_STYLE_KEY, window.NBConfig.MATCH_LIST_STYLE);
const cachedBettingMode = loadFromStorage(StorageKey.BETTING_MODE_KEY, window.NBConfig.BETTING_MODE);

const { APP_MODE } = window.NBConfig;
const isLite = APP_MODE === AppModes.STANDALONE_LITE;

const { body } = document;

// 设置默认皮肤
setTheme(cachedTheme);
const bodyClass = body.className.replace(/(black|white|blue)/gi, '');
body.className = `${cachedTheme} ${bodyClass.trim()}`.trim();

const appState = {
  isLoged: !!(cachedUserinfo && cachedUserinfo.token),
  userinfo: cachedUserinfo || {},
  scanInfo: scanUserInfo || {},
  // 0 单式, 1 串关    默认 0
  multType: 0,
  // 是否横屏
  horizScreen: false,
  // 皮肤设定 white 白色, black 黑色, blue 深蓝色
  theme: cachedTheme,
  // 前端标志id
  frontId: null,
  // 是否是原生App
  isNative: false,
  // 商户域名
  portalDomain: null,
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
  jumpObjNew: null,
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
  adObject: null,
  ptObject: null,
  homeNotice: null,
  showProto: false,
  nbFilterClass: false,
  matchListUpdateFlag: null,
  lastGoBackTime: 0,
  videoLock: cachedVideoLock,
  lastPath: null,
  lockIOSSwipe: false,
  pageAziFlag: false,
  shareTarget: '',
  teachList: null,
  teachSets: cachedUserTeach,
};

const mutations = {
  setCryptKey(state, key) {
    state.cryptKey = key || '';
  },
  setAGRegType(state, type) {
    state.agRegType = /^[23]$/.test(type) ? type : 2;
  },
  getUserInfo(state) {
    state.scanInfo = loadFromStorage(StorageKey.SCAN_CODE_USER_KEY, null);
    state.userinfo = loadFromStorage(StorageKey.CASINO_USER_KEY, null);
    state.isLoged = !!(state.userinfo && state.userinfo.token);
    if (!state.isLoged) store.commit('member/setMemberInfo');
  },
  setUserinfo(state, userinfo) {
    mutations.updateUserinfo(state, userinfo);
    reconnect();
  },
  updateUserinfo(state, userinfo) {
    saveToStorage(StorageKey.CASINO_USER_KEY, userinfo || null);
    mutations.getUserInfo(state);
    if (userinfo && userinfo.token) {
      mutations.updateScanInfo(state);
    }
  },
  updateScanInfo(state, scanInfo) {
    const scInfo = state.isLoged ? null : scanInfo;
    saveToStorage(StorageKey.SCAN_CODE_USER_KEY, scInfo || null);
    mutations.getUserInfo(state);
  },
  updateMultType(state, type) {
    state.multType = [0, 1].includes(type) ? type : 0;
  },
  setHorizontal(state, horiz) {
    state.horizScreen = !!horiz;
  },
  setLockIOSSwipe(state, status) {
    state.lockIOSSwipe = !!status;
  },
  toggleTheme(state, theme) {
    const thmStr = state.bettingMode === 3 ? 'bluewhite' : 'blackwhite';
    const defThm = thmStr.replace(state.theme, '');
    const thm = state.theme;
    state.theme = /^(black|blue|white)$/.test(theme) ? theme : defThm;
    setTheme(state.theme);
    body.className = body.className.replace(thm, state.theme).trim();
    saveToStorage(StorageKey.USER_THEME_KEY, state.theme);
  },
  setNbFilterClass(state, flag) {
    state.nbFilterClass = !!flag;
  },
  setVideoLock(state) {
    state.videoLock = !state.videoLock;
    saveToStorage(StorageKey.VIDEO_LOCK_KEY, state.videoLock);
  },
  updatePortalInfo(state, portalInfo) {
    state.portalInfo = portalInfo;
  },
  setTabHeight(state, height) {
    state.tabHeight = height || '0';
  },
  setPageAziFlag(state, flag) {
    state.pageAziFlag = !!flag;
  },
  updateToast(state, str) {
    state.toastStr = str || '';
    mutations.getUserInfo(state);
  },
  updateLastGoBackTime(state) {
    state.lastGoBackTime = Date.now();
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
  setJumpNewObject(state, obj) {
    state.jumpObjNew = obj && typeof obj === 'object' && obj.constructor !== Array ? obj : null;
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
  updateIsNative(state, native) {
    state.isNative = !!native;
  },
  /**
   * 更新商户域名
   */
  updatePortalDomain(state, portalDomain) {
    state.portalDomain = portalDomain;
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
  updateAdObject(state, obj) {
    state.adObject = obj || null;
  },
  updatePtObject(state, obj) {
    state.ptObject = obj || null;
  },
  setHomeNotice(state, obj) {
    state.homeNotice = obj || null;
  },
  setShowProto(state, status) {
    state.showProto = !!status;
  },
  refreshMatchListToken(state) {
    state.matchListUpdateFlag = Date.now();
  },
  setLastPath(state, path) {
    state.lastPath = path;
  },
  setTeachList(state, obj) {
    const arrId = obj && /^[0123]$/.test(obj.id) ? +obj.id : 0;
    const hasArr = obj && obj.data && obj.data.length;
    state.teachList = hasArr ? obj.data : [];
    if (hasArr) {
      state.teachSets[arrId] = true;
      saveToStorage(StorageKey.USER_TEACH_KEY, state.teachSets || [false, false, false, false]);
    }
  },
  setShareTarget(state, from) {
    state.shareTarget = from || '';
  },
};

const actions = {
  async reloadBalance({ state, commit }) {
    commit('updateBalanceLoading', true);
    let data = null;
    const nbBalance = await getAmountRefresh();
    data = { totalBalance: (+nbBalance[1]) || 0, otherBalance: (+nbBalance[0]) || 0 };
    if (state.userinfo && state.userinfo.token) {
      if (data.localBalance !== undefined && data.localBalance > 1) {
        transferToGame(true);
      } else if (data.gameBalance !== undefined && data.totalBalance - data.gameBalance > 1) {
        transferToGame(false);
      } else if (data.otherBalance !== undefined && data.totalBalance < 1 && data.otherBalance > 1) {
        transferToGame(false);
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
  async toLoginPage() {
    toPoralUrlByKey('LOGIN_PAGE_URL');
  },
  async transferToNB({ state }) {
    const hasUrl = /^[a-z]+:\/\//.test(window.NBConfig.PORTAL_API_URL);
    const pSet = window.NBConfig.PORTAL_SETTING;
    const loginApi = pSet && pSet.LOGIN_API ? pSet.LOGIN_API : null;
    if (state.userinfo && state.userinfo.token) {
      if ((pSet && pSet.USER_CENTER_URL) || AppModes.SEAMLESS === window.NBConfig.APP_MODE) {
        const hasURI = hasUrl && loginApi && loginApi.URI;
        if (hasURI && /^(get|post)$/i.test(loginApi.METHOD)) {
          await portalTrans({ to: 'NB' });
        }
      } else {
        await transferToGame(false);
      }
    }
  },
};

export default {
  namespaced: true,
  state: appState,
  mutations,
  actions,
};
