import deviceInfo from '@/utils/deviceInfo';

// 创建调用app的iframe
let appSchemeInvoker = null;
if (deviceInfo.appInfo.isApp) {
  appSchemeInvoker = window.document.createElement('iframe');
  appSchemeInvoker.style.display = 'none';
  document.body.appendChild(appSchemeInvoker);
}

/**
 * 通过scheme的方式调用app并传入参数
 *
 * @param {string} invokeType
 *    请求类别字符串
 * @param {object} data
 *    需要传入的参数
 */
export const invokeByScheme = (invokeType, data = {}) => {
  if (!deviceInfo.appInfo.isApp) {
    return;
  }

  const invokeUrl = `nbapp://${invokeType}?data=${encodeURIComponent(JSON.stringify(data))}`;

  if (invokeUrl === appSchemeInvoker.src) {
    appSchemeInvoker.reload();
    return;
  }

  appSchemeInvoker.src = invokeUrl;
};

/**
 * 在浏览器中打开地址
 *
 * @param {string} url
 *    需要打开的地址
 */
export const openInBrowser = (url) => {
  invokeByScheme('openInBrowser', { url });
};

export const setTheme = (theme) => {
  const themeMapping = {
    white: 0,
    black: 1,
  };
  invokeByScheme('setTheme', { theme: themeMapping[theme] || 0 });
};
