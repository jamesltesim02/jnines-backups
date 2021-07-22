import Vue from 'vue';
import router from '@/router';
import appConfig from '@/config/business.config';
import { StorageKey, AppModes } from '@/config/constants';
import { loadFromStorage, saveToStorage, getCacheData } from '@/utils/StorageUtil';
import { connect, reconnect, regpush } from '@/utils/PushUtil';
import { getAppInit } from '@/api/portalAgyy';
import { finddomaininfo } from '@/api/pull';
import { getBetBalance } from '@/api/bet';
import getParameter from '@/utils/getParameter';
import store from '@/store';

const {
  location,
  history,
  NBConfig: {
    APP_MODE,
  },
} = window;

/**
 * 商户接入参数配置初始化
 */
const casinoInfoInit = () => {
  // 如果不是seamless,则直接从配置文件中获取frontId并不做其他初始化
  if (APP_MODE !== AppModes.SEAMLESS) {
    store.commit('app/updateFrontId', window.NBConfig.FRONT_ID);
    return;
  }

  // 优先从参数中获取frontId,没取到则从缓存中获取
  let frontId = getParameter('frontId');
  if (!frontId) {
    frontId = loadFromStorage(StorageKey.SEAMLESS_FRONTID_KEY);
    // 如果参数和缓存中都没有frontId则提示参数有问题并不提供服务功能
    if (!frontId) {
      location.href = '/#/error/412';
      // TODO 提示并转到无服务页面
      return;
    }
  } else {
    saveToStorage(StorageKey.SEAMLESS_FRONTID_KEY, frontId);
  }
  store.commit('app/updateFrontId', frontId);

  // 用户token
  const token = getParameter('token');
  if (token) {
    store.commit('app/setUserinfo', { token });
  }

  // 商户参数
  const backUrl = getParameter('backUrl');
  // 存款地址
  const depositUrl = getParameter('depositUrl') || backUrl;
  // 登录地址
  const loginUrl = getParameter('loginUrl') || backUrl;
  if (backUrl || depositUrl || loginUrl) {
    const portalParams = {
      backUrl,
      depositUrl,
      loginUrl,
    };
    store.commit('app/updatePortalParams', portalParams);
    saveToStorage(StorageKey.PORTAL_PARAMS_KEY, portalParams);
  } else {
    store.commit(
      'app/updatePortalParams',
      loadFromStorage(StorageKey.PORTAL_PARAMS_KEY, {}),
    );
  }
  history.replaceState(
    null,
    null,
    `${location.protocol}//${location.host}/${location.hash}`,
  );
};

/**
 * AG加密Key和注册验证方式初始化
 */
const AGKeyAndTypeInit = async () => {
  const data = await getAppInit();
  if (data && data.cryptoKey) {
    store.commit('app/setCryptKey', data.cryptoKey);
  }
  if (data && data.registerVerificationType) {
    store.commit('app/setAGRegType', data.registerVerificationType);
  }
};

/**
 * 商户配置初始化
 */
const portalInit = async () => {
  let portalInfo = await getCacheData(
    StorageKey.PORTAL_SETTING_KEY,
    appConfig.portalCacheTime,
    finddomaininfo,
  );

  // 无法查询到商户配置
  if (!portalInfo || !portalInfo.length) {
    // TODO 提示并重定向
    return;
  }
  [portalInfo] = portalInfo;
  // 更新商户配置信息
  store.commit('app/updatePortalInfo', portalInfo);
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

    // seamless模式，且进了非展示页，跳转至足球页，页面id及说明详见@/router/index.js
    const noShowPage = /^(10\d|2\d{2}|500|5[1-9]\d)$/.test(to.meta.index);
    if (AppModes.SEAMLESS === APP_MODE && noShowPage) {
      next({ path: '/matchs/0/10' });
      return;
    }

    // 4XX: 投注单，投注记录类页面, 5XX: 我的，个人中心，设置等相关页面，设置页面501-509允许不登录进入
    const isPerson = /^(4\d{2}|500|5[1-9]\d)$/.test(to.meta.index);
    // 是否登录
    const isLogin = store.state.app.isLoged;

    if (isLogin && ['/login', '/register'].includes(to.fullPath)) {
      next({ path: '/' });
    }

    if (isLogin || !isPerson) {
      next();
      if (/^2\d{2}$/.test(to.meta.index)) {
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

    store.commit('app/updateLastLocation', to);
    // 如果是非Seamless则转到login页面
    next({ path: '/login' });
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
    if (event.target.tagName !== 'INPUT') blurInputs();
    if (event.touches.length > 1) event.preventDefault();
  });
  document.addEventListener('touchmove', blurInputs);
  document.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
  }, false);
  document.addEventListener('gesturestart', (event) => {
    event.preventDefault();
  }, false);
  document.addEventListener('gesturechange', (event) => {
    event.preventDefault();
  }, false);
};

// 保持session和token的定时任务
const keepPortalSession = () => {
  if (APP_MODE !== AppModes.STANDALONE_LITE) {
    return;
  }

  // 保障AG session有效定时任务
  setInterval(() => {
    // 如果未登录,则不用发起更新请求
    if (!store.state.app.isLoged) {
      return;
    }
    // 发起更新用户信息action,目的保持session有效
    store.dispatch('app/agRealodUserinfo');
  }, appConfig.keepPortalSessionTime);

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
    // 现金网接入seamless判断及初始化
    casinoInfoInit();
    // 如果没有找到frontId则不再继续进行初始化
    if (!store.state.app.frontId) {
      return;
    }
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
    // 获取AG配置
    if (/^3$/.test(APP_MODE)) {
      AGKeyAndTypeInit();
    }
  },
};
