import Axios from 'axios';
import store from '@/store';
import appConfig from '@/config/business.config';
import { getLangValue } from '@/utils/I18nUtil';
import { BusinessCodes } from '@/config/constants';
import { getToken, logout } from '@/utils/UserinfoUtil';

// 创建axios对象
const axios = Axios.create({
  baseURL: window.NBConfig.PORTAL_API_URL || '',
  headers: window.NBConfig.PORTAL_API_HEADS || { 'Content-Type': 'application/json;charse=UTF-8' },
  withCredentials: true,
  timeout: appConfig.apiTimeout,
  validateStatus: status => /^(2\d{2}|401)$/.test(status),
});

// 请求拦截器
axios.interceptors.request.use(
  (reqConf) => {
    if (!reqConf) {
      return null;
    }
    const config = { ...reqConf };
    const dataKey = { post: 'data', get: 'params' }[config.method];
    if (dataKey) {
      config[dataKey] = { lang: getLangValue(), token: getToken(), ...config[dataKey] };
    }
    return config;
  },
  (e) => {
    console.warn('request error');
    store.commit('app/toast', 'message.netError');
    return Promise.reject(e);
  },
);

// 响应拦截器, 处理响应结果
axios.interceptors.response.use(
  ({ data }) => {
    if (BusinessCodes.SERVICE_ERROR_503 === data.code) {
      window.location = '/#/error/503';
    } else if (BusinessCodes.SERVICE_ERROR_403 === data.code) {
      window.location = '/#/error/403';
    } else if (/^(300|405)$/.test(data.code)) {
      store.commit('app/toast', { msg: 'message.logOuttime' });
      logout();
      return null;
    }
    return /^20[01]$/.test(data.code) ? data.data : Promise.reject(data);
  },
  (e) => {
    console.warn('network error.');
    store.commit('app/toast', 'message.netError');
    return Promise.reject(e);
  },
);

/**
 * 登录
 */
export const portalLogin = (params) => {
  const hasUrl = /^[a-z]+:\/\//.test(window.NBConfig.PORTAL_API_URL);
  const pSet = window.NBConfig.PORTAL_SETTING;
  const loginApi = pSet && pSet.LOGIN_API ? pSet.LOGIN_API : null;
  if (hasUrl && loginApi && loginApi.URI && /^get$/i.test(loginApi.METHOD)) {
    return axios.get(loginApi.URI, params);
  }
  if (hasUrl && loginApi && loginApi.URI && /^post$/i.test(loginApi.METHOD)) {
    return axios.post(loginApi.URI, params);
  }
  return null;
};

/**
 * 转额
 */
export const portalTrans = (params) => {
  const hasUrl = /^[a-z]+:\/\//.test(window.NBConfig.PORTAL_API_URL);
  const pSet = window.NBConfig.PORTAL_SETTING;
  const transApi = pSet && pSet.TRANS_API ? pSet.TRANS_API : null;
  if (hasUrl && transApi && transApi.URI && /^get$/i.test(transApi.METHOD)) {
    return axios.get(transApi.URI, params);
  }
  if (hasUrl && transApi && transApi.URI && /^post$/i.test(transApi.METHOD)) {
    return axios.post(transApi.URI, params);
  }
  return null;
};
