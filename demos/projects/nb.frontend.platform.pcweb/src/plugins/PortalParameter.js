import getParameter from '@/utils/getParameter';
import { StorageKey } from '@/config/constants';
import { saveToStorage, loadFromStorage } from '@/utils/StorageUtil';
import { getBetBalance } from '@/api/bet';
import store from '@/store';

const {
  location,
  // history,
  NBConfig: {
    FRONT_ID,
    PORTAL_SETTING,
  },
} = window;

export default {
  async install() {
    let frontId = getParameter('frontId');
    if (frontId) {
      saveToStorage(StorageKey.FRONT_ID_KEY, frontId);
    } else {
      frontId = loadFromStorage(StorageKey.FRONT_ID_KEY) || FRONT_ID;
    }
    store.commit('app/updateFrontId', frontId);

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
    // 用户token
    const token = getParameter('token');
    if (token) {
      const userinfo = await getBetBalance({ token });
      store.commit(
        'app/setUserinfo',
        {
          ...userinfo,
          token,
          memberAccount: loginName,
        },
      );
    }

    const memberToken = getParameter('memberToken');
    if (memberToken) {
      saveToStorage(StorageKey.PORTAL_MEMBER_TOKEN, memberToken);
    }
  },
};
