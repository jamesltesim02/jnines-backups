import { openInBrowser } from './AppUtils';
import { toPoralUrlByKey } from '@/utils/PortalUtils';

/**
 * 打开在线客服
 *
 */
export const toCustomerService = () => {
  toPoralUrlByKey('SERVICE_CENTER_URL', true);
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

  openInBrowser(portalUrl);
};
