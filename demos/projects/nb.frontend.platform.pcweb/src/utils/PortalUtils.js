import store from '@/store';

const { FRONT_ID, PORTAL_SETTING = {} } = window.NBConfig;
const portalSetting = PORTAL_SETTING[FRONT_ID] || PORTAL_SETTING.DEFAULT || PORTAL_SETTING;

/**
 * 获取商户配置常量
 */
export const getSettings = () => portalSetting;

/**
 *  获取指定商户配置属性
 *
 * @param {string} attr
 *    指定配置名
 */
export const getSettingAttr = attr => getSettings()[attr];

/**
 * 获取商户的域名
 */
export const getPortalDomain = () => {
  const domain = store.state.app.portalDomain || window.NBConfig.PORTAL_SETTING.DOMAIN;
  if (!domain) {
    throw new Error('Portal domain is invalid, make sure you have "portalUrl" param or "PORTAL_SETTING.DOMAIN" configuration.');
  }

  return domain || '';
};

/**
 * 转到商户的指定地址
 *
 * @param {string} url 指定地址
 */
export const toPortalUrl = (url) => {
  const [
    symbal,
    orgin,
  ] = [
    /.+?#.+?\?.*/.test(url) ? '&' : '?',
    encodeURIComponent(window.location.href.replace(/\?.*/gi, '')),
    window.location.host,
  ];
  window.open(`${url}${symbal}nborigin=${orgin}`);
};

/**
 * 根据配置key转到商户地址
 *
 * @param {string} key 配置key
 */
export const toPortalUrlByKey = (key) => {
  const portalDomain = getPortalDomain();
  let targetUrl = getSettingAttr(key);
  if (!targetUrl) {
    console.warn(`Portal config [${key}] not found.`);
    return;
  }
  if (!/^https?:\/\/.+/gi.test(targetUrl)) {
    if (FRONT_ID === '102001011JIaThBA' && !portalDomain) {
      store.commit('agyy/pushRouter', targetUrl);
      return;
    }
    if (targetUrl.charAt(0) !== '/') {
      targetUrl = `/${targetUrl}`;
    }
    targetUrl = `${portalDomain}${targetUrl}`;
  }
  toPortalUrl(targetUrl);
};
