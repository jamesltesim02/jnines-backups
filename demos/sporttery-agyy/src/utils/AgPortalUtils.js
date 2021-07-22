import md5 from 'md5';
import store from '@/store';
import { PortalAgyyConfig } from '@/config/constants';

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
    lastLocation,
  } = store.state.app;

  const timestamp = Date.now();
  const {
    href,
    protocol,
    host,
    search,
  } = window.location;

  const {
    userId,
    memberAccount,
    memberLevel,
  } = isLoged ? userinfo : {
    userId: timestamp,
    memberAccount: context.$t('pagelite.guest'),
    memberLevel: 0,
  };

  const {
    baseUrl,
    companyID,
    configID,
    encryptkey: agkey,
  } = PortalAgyyConfig.CUSERVICE;

  const [
    name,
    encryptkey,
    enterurl,
    memo,
  ] = [
    isLoged ? `${context.$t((memberLevel >= 0 ? 'pagelite.level' : 'pagelite.black'))}:${memberLevel}` : '',
    isLoged ? agkey : undefined,
    `${protocol}//${host}${search ? `?${search}` : ''}/#${lastLocation.fullPath}` || href,
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

export default {};
