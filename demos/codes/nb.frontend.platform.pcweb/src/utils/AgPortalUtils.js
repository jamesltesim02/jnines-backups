import md5 from 'md5';
import store from '@/store';
import { getSettingAttr } from '@/utils/PortalUtils';
import { AgyyConfig } from '@/components/Portal/portals/PortalAgyy/agyy-constant';

/**
 * 获取live800地址
 *
 * @param {object} context
 *    调用当前函数的上下文
 */
export const live800Url = (context) => {
  if (!context) {
    throw new Error('Context should not be null.');
  }

  const {
    isLoged,
    userinfo,
  } = store.state.app;

  const timestamp = Date.now();
  const {
    href,
  } = window.location;

  const {
    userId,
    memberAccount,
    memberLevel,
  } = isLoged ? userinfo : {
    userId: timestamp,
    memberAccount: context.$t('agPage.service.guest'),
    memberLevel: 0,
  };

  const {
    baseUrl,
    companyID,
    configID,
    encryptkey: agkey,
  } = AgyyConfig.CUSERVICE;

  const [
    name,
    encryptkey,
    enterurl,
    memo,
  ] = [
    isLoged ? `${context.$t((memberLevel >= 0 ? 'agPage.service.level' : 'agPage.service.black'))}:${memberLevel}` : '',
    isLoged ? agkey : undefined,
    href,
    '',
  ];

  const hashCode = md5(
    encodeURIComponent(
      `${userId}${memberAccount}${memberLevel}${name}${timestamp}${encryptkey}`,
    ).toLocaleUpperCase(),
  ).toLocaleUpperCase();

  const info = encodeURIComponent(
    `userId=${
      userId
    }&loginname=${
      memberAccount
    }&grade=${
      memberLevel
    }&name=${
      name
    }&memo=${
      memo
    }&hashCode=${
      hashCode
    }&timestamp=${
      timestamp
    }`,
  );

  return `${baseUrl}?companyID=${companyID}&configID=${configID}&enterurl=${enterurl}&info=${info}&timestamp=${timestamp}`;
};

/**
 * 打开在线客服
 *
 * @param {object} context
 *    调用时的上下文
 */
export const toCustomerService = (context) => {
  const serviceUrl = getSettingAttr('SERVICE_CENTER_URL');
  if (serviceUrl) {
    const url = `${serviceUrl}${/\?/.test(serviceUrl) ? '&' : '?'}from=NB&backUrl=`;
    window.open(`${url}${encodeURIComponent(window.location.href)}`, '_blank');
  } else {
    window.open(live800Url(context), '_blank');
  }
};

/**
 * 打开存款提交页面
 *
 * @param {object} params
 *     存款订单参数
 */
export const openToPayment = (params) => {
  const { protocol, host } = window.location;
  const orderInfo = encodeURIComponent(JSON.stringify(params));
  const portalUrl = `${protocol}//${host}/payment-forward.html?${orderInfo}`;
  window.open(portalUrl, '_blank');
};
