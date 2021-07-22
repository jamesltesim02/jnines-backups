import Vue from 'vue';
import router from '@/router';
import appConfig from '@/config/business.config';
import { StorageKey, AppModes } from '@/config/constants';
import { loadFromStorage, saveToStorage, getCacheData } from '@/utils/StorageUtil';
import { connect, reconnect, regpush } from '@/utils/PushUtil';
// import { getAppInit } from '@/api/portalAgyy';
import { finddomaininfo } from '@/api/pull';
import { getBetBalance } from '@/api/bet';
import getParameter from '@/utils/getParameter';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import store from '@/store';

const {
  location,
  history,
  NBConfig: {
    FRONT_ID,
    APP_MODE,
    HOME_IS_MATCH_LIST,
    PORTAL_SETTING,
  },
} = window;

/**
 * 商户配置初始化
 */
const portalInit = async () => {
  let frontId = getParameter('frontId');
  if (frontId) {
    saveToStorage(StorageKey.FRONT_ID_KEY, frontId);
  } else {
    frontId = loadFromStorage(StorageKey.FRONT_ID_KEY) || FRONT_ID;
  }
  store.commit('app/updateFrontId', frontId);
  let isNative = getParameter('native');
  saveToStorage(StorageKey.APP_IS_NATIVE, !!isNative);
  isNative = !!loadFromStorage(StorageKey.APP_IS_NATIVE);
  store.commit('app/updateIsNative', isNative);
  let portalUrl = getParameter('portalUrl') || document.referrer;
  const tempPortalUrl = loadFromStorage(StorageKey.PORTAL_DOMAIN_KEY, PORTAL_SETTING.DOMAIN);

  if (portalUrl) {
    portalUrl = decodeURIComponent(portalUrl);
    try {
      if (!/https?:\/\/.+/gi.test(portalUrl)) {
        portalUrl = `http://${portalUrl}`;
      }
      const puObject = new URL(portalUrl);
      if (puObject.host === location.host) {
        portalUrl = tempPortalUrl;
      } else {
        portalUrl = `${puObject.protocol}//${puObject.host}`;
      }

      saveToStorage(StorageKey.PORTAL_DOMAIN_KEY, portalUrl);
    } catch (e) {
      console.warn('商户域名格式有误', e);
    }
  } else {
    portalUrl = tempPortalUrl;
  }
  store.commit('app/updatePortalDomain', portalUrl);

  const loginName = getParameter('loginName');
  if (loginName) {
    saveToStorage(StorageKey.PORTAL_LOGIN_NAME, loginName);
  }

  // 游戏token
  const token = getParameter('token');
  if (token && `${token}`.length > 15) {
    const balance = await getBetBalance({ token });
    store.commit('app/setUserinfo', {
      token,
      memberAccount: loginName,
      ...balance,
    });
  }
  const memberToken = getParameter('memberToken');
  if (memberToken) {
    saveToStorage(StorageKey.PORTAL_MEMBER_TOKEN, memberToken);
  }
  // 扫码参数存储
  const invoteCode = getParameter('c');
  const invoteFrom = getParameter('f');
  const isLogin = store.state.app.isLoged;
  if (isLogin) {
    store.commit('app/updateScanInfo');
  } else if (invoteCode && invoteFrom) {
    store.commit('app/updateScanInfo', { invoteCode, invoteFrom });
  }

  const portalInfo = await getCacheData(
    StorageKey.PORTAL_SETTING_KEY,
    appConfig.portalCacheTime,
    finddomaininfo,
  );

  if (portalInfo) {
    // 更新商户配置信息
    store.commit('app/updatePortalInfo', portalInfo);
  }

  history.replaceState(
    null,
    null,
    `${location.protocol}//${location.host}/${location.hash}`,
  );
};

/**
 * 消息推送初始化
 */
const pushInit = () => {
  // 启动push连接
  connect();
  Vue.prototype.$regpush = regpush;

  window.onfocus = () => {
    reconnect();
  };
};

/**
 * 连接登录检查
 */
const routerLoginCheck = () => {
  router.beforeEach((to, from, next) => {
    store.commit('app/updateToast', '');
    store.commit('app/updateLastLocation', from);
    store.commit('payment/updatePopInfo', null);
    const isLogin = store.state.app.isLoged;
    const frtId = store.state.app.frontId;
    // seamless模式或亚游轻量模式，扫码新用户，跳注册页；ag用户跳登录页
    const isSmStand = AppModes.SEAMLESS === APP_MODE || AppModes.STANDALONE_LITE === APP_MODE;
    const isFromAg = frtId === '102001011JIaThBA' && /^101$/.test(to.meta.index);
    const isScan = store.state.app.scanInfo && /^102$/.test(to.meta.index);
    if (isSmStand && !isLogin && (isScan || isFromAg)) {
      next();
      return;
    }
    // seamless模式，且进了非展示页，跳转至足球页，页面id及说明详见@/router/index.js
    const noShowPage = /^(10\d|[29]\d{2}|800|8[1-9]\d)$/.test(to.meta.index);
    if (AppModes.SEAMLESS === APP_MODE && noShowPage) {
      next({ path: '/' });
      return;
    }
    // 个人中心设置了跳转地址，则个人中心相关页面跳转到首页
    const api = PORTAL_SETTING && PORTAL_SETTING.LOGIN_API ? PORTAL_SETTING.LOGIN_API : null;
    const pass = api && api.URI && /^(get|post)$/i.test(api.METHOD);
    const userReg = new RegExp(`^(10[0${pass ? '' : '1'}2]|8[1-9]\\d)$`);
    if (PORTAL_SETTING && PORTAL_SETTING.USER_CENTER_URL && userReg.test(to.meta.index)) {
      next({ path: '/' });
      return;
    }
    // 4XX: 投注单，投注记录类页面, 5XX: 我的，个人中心，设置等相关页面，设置页面501-509允许不登录进入
    const isPerson = /^(4\d{2}|800|8[1-9]\d)$/.test(to.meta.index);
    if (isLogin && /^10[12]$/.test(to.meta.index)) {
      next({ path: '/' });
    }
    if (isLogin || !isPerson) {
      next();
      if (/^2\d{2}$/.test(to.meta.index) && !HOME_IS_MATCH_LIST) {
        store.commit('clearBetItem');
      }
      return;
    }
    // 如果是Seamless则返回原地址并提示消息
    if (AppModes.SEAMLESS === APP_MODE) {
      next({ path: from.path });
      store.commit('app/updateToast', 'pageBet.notLogin');
      return;
    }
    toPoralUrlByKey('LOGIN_PAGE_URL');
  });
  let isFirst = true;
  router.afterEach((to, { fullPath }) => {
    if (isFirst) {
      isFirst = false;
      return;
    }
    store.commit('app/setLastPath', fullPath);
  });
};

/**
 * 禁止苹果缩放
 */
const blurInputs = () => {
  setTimeout(() => { document.querySelectorAll('input:focus').forEach(v => v.blur()); }, 100);
};

const disableAppleZoom = () => {
  let lastTouchEnd = 0;
  document.addEventListener('touchstart', (event) => {
    if (event.target.tagName !== 'INPUT') {
      blurInputs();
    }
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });
  document.addEventListener('touchmove', blurInputs, { passive: false });
  document.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
  document.addEventListener('gesturestart', (event) => {
    event.preventDefault();
  }, { passive: false });
  document.addEventListener('gesturechange', (event) => {
    event.preventDefault();
  }, { passive: false });
};

// 保持session和token的定时任务
const keepPortalSession = () => {
  // 保障AG token有效定时任务
  setInterval(async () => {
    // 如果未登录,则不用发起更新请求
    if (!store.state.app.isLoged) {
      return;
    }
    // 发起查询用户信息调用, 会调用QueryAccount来保持tokne有效
    await getBetBalance();
  }, appConfig.keepPortalTokenTime);
};

export default {
  install() {
    // 商户配置初始化
    portalInit();
    // 消息推送初始化
    pushInit();
    // 注册登录检查
    routerLoginCheck();
    // 禁止苹果缩放
    disableAppleZoom();
    // 保持商户session有效
    keepPortalSession();
  },
};
