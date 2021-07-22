import axios from 'axios';
import store from '@/store';
import appConfig from '@/config/business.config';
import { BusinessCodes } from '@/config/constants';
import { getLangValue } from '@/utils/I18nUtil';
import { getToken, logout } from '@/utils/UserinfoUtil';

export default (conf) => {
  const instance = axios.create(conf);
  instance.defaults.timeout = appConfig.apiTimeout;
  instance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
  // 请求拦截器,设置baseurl以及默认的语言参数
  instance.interceptors.request.use(
    (reqConf) => {
      if (!reqConf) {
        return null;
      }
      const config = { ...reqConf };
      const dataKey = { post: 'data', get: 'params' }[config.method];
      const [ua, qt] = [window.navigator.userAgent, Date.now()];
      let ctp = /(android|mobile|MQQBrowser)/i.test(ua) ? 3 : 1;
      ctp = /(phone|pad|pod|ios)/i.test(ua) ? 2 : ctp;
      ctp = +(`3${ctp}${/\s+nb\//i.test(ua) ? 1 : 0}0`);
      if (dataKey) {
        config[dataKey] = {
          lang: getLangValue(),
          frontId: store.state.app.frontId,
          token: getToken(),
          ctp,
          qt,
          ...config[dataKey],
        };
      }
      return config;
    },
    (e) => {
      console.warn('request error');
      store.commit('app/toast', 'message.netError');
      return Promise.reject(e);
    },
  );

  // 添加响应拦截器
  instance.interceptors.response.use(
    ({ data }) => {
      // 系统维护
      if (BusinessCodes.SERVICE_ERROR_503 === data.code) {
        window.location = '/#/error/503';
      // 地域限制
      } else if (BusinessCodes.SERVICE_ERROR_403 === data.code) {
        window.location = '/#/error/403';
      } else if (/^(300|405)$/.test(data.code)) {
        // 重新登录
        store.commit('app/toast', { msg: 'message.logOuttime' });
        logout();
        return null;
      }
      const rtn = data.data && data.extras ? data : data.data;
      return /^20[01]$/.test(data.code) ? rtn : Promise.reject(data);
    },
    (e) => {
      console.warn('network error.');
      store.commit('app/toast', 'message.netError');
      return Promise.reject(e);
    },
  );
  return instance;
};
