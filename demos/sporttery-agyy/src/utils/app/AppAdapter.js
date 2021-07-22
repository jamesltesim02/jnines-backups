import deviceInfo from '../deviceInfo';
import { openInBrowser } from './AppUtils';
import { live800Url } from '../AgPortalUtils';

export const openBrowser = (url) => {
  if (!deviceInfo.appInfo.isApp) {
    window.open(url);
    return;
  }

  openInBrowser(url);
};

/**
 * 打开在线客服
 *
 * @param {object} context
 *    调用时的上下文
 */
export const toCustomerService = (context) => {
  openBrowser(live800Url(context));
};

/**
 * 打开存款提交页面
 *
 * @param {object} params
 *     存款订单参数
 */
export const openToPayment = (params) => {
  const {
    protocol,
    host,
  } = window.location;

  const orderInfo = encodeURIComponent(JSON.stringify(params));
  const portalUrl = `${protocol}//${host}/payment-forward.html?${orderInfo}`;
  // store.commit('payment/updatePortalUrl', portalUrl);

  openBrowser(portalUrl);
};
