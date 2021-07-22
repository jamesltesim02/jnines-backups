import { loadFromStorage } from '@/utils/StorageUtil';
import { StorageKey } from '@/config/constants';
import { openInBrowser } from '@/utils/app/AppUtils';
import store from '@/store';
import deviceInfo from '@/utils/deviceInfo';
import router from '@/router';

/**
 * 转到商户页面
 *
 * @param {string} url
 *    商户页面地址
 */
export const toPortalUrl = (url, extraBrowserWithApp = false) => {
  const {
    protocol,
    host,
    pathname,
    hash,
  } = window.location;

  const urlObj = new URL(url);
  const params = {
    nborigin: encodeURIComponent(`${protocol}//${host}${pathname}${hash.split('?')[0] || ''}`),
    memberToken: loadFromStorage(StorageKey.PORTAL_MEMBER_TOKEN, ''),
  };

  // 适配亚游自动登陆功能的参数
  if (store.state.app.frontId === '102001011JIaThBA') {
    params.token = params.memberToken;
    params.merchant = 'nbbets';
  }

  const paramsStr = `${
    urlObj.search ? `${urlObj.search.substring(1)}&` : ''
  }${
    Object.entries(params)
      .filter(kv => !!kv[1])
      .map(kv => `${kv[0]}=${kv[1]}`)
      .join('&')
  }`;

  const forwardUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}?${paramsStr}${urlObj.hash}`;

  if (extraBrowserWithApp || (deviceInfo.appInfo.isApp && store.state.app.isNative)) {
    openInBrowser(forwardUrl);
  } else {
    window.location = forwardUrl;
  }
};

/**
 * 获取商户的域名
 */
export const getPortalDomain = () => {
  const domain = store.state.app.portalDomain || window.NBConfig.PORTAL_SETTING.DOMAIN;
  if (!domain) {
    throw new Error('Portal domain is invalid, make sure you have "portalUrl" param or "PORTAL_SETTING.DOMAIN" configuration.');
  }

  return domain;
};

/**
 * 转到指定配置key的商户地址
 */
export const toPoralUrlByKey = (key, extraBrowserWithApp = false) => {
  const {
    NBConfig: {
      PORTAL_SETTING,
    },
  } = window;

  // 亚游登录特殊处理
  const frtId = store.state.app.frontId;
  if (/^LOGIN_PAGE_URL$/i.test(key) && frtId === '102001011JIaThBA') {
    router.push('/login');
    return;
  }

  let targetUrl = PORTAL_SETTING[key];
  if (!targetUrl) {
    console.warn(`Portal config [${key}] not found.`);
    return;
  }

  if (!/^https?:\/\/.+/gi.test(targetUrl)) {
    if (targetUrl.charAt(0) !== '/') {
      targetUrl = `/${targetUrl}`;
    }
    targetUrl = `${getPortalDomain()}${targetUrl}`;
  }

  toPortalUrl(targetUrl, extraBrowserWithApp);
};

/**
 * 跳转到需要登陆的地址, 如果未登录则直接跳转登陆页面
 *
 * @param {string} path
 *   将要转到的地址
 */
export const pushToLogedPath = (path) => {
  if (!store.state.app.isLoged) {
    toPoralUrlByKey('LOGIN_PAGE_URL');
    return;
  }
  router.push(path);
};

export const toLogedPortalUrlKey = (key, extraBrowserWithApp = false) => {
  if (!store.state.app.isLoged) {
    toPoralUrlByKey('LOGIN_PAGE_URL', extraBrowserWithApp);
    return;
  }
  toPoralUrlByKey(key, extraBrowserWithApp);
};
