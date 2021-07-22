import Axios from 'axios';
import store from '@/store';

import opsConfig from '@/config/config.ops';

Axios.defaults.withCredentials = true;

export default (conf = {}) => {
  const instance = Axios.create({
    baseURL: opsConfig.API_URL,
    ...conf
  });
  instance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

  instance.interceptors.request.use(
    // request拦截
    (reqConfig) => {
      const {
        state: { app: { userinfo } },
        getters: { 'app/isLogin': isLogin }
      } = store

      // 统一设置token
      if (isLogin) {
        reqConfig.headers.Authorization = userinfo.token;
      }

      return reqConfig;
    },
    // request error处理
    (err) => {
      console.log('reqeust error:', err)
      return Promise.reject(err);
    }
  );

  instance.interceptors.response.use(
    // response 拦截
    ({
      data: {
        code,
        data,
        msg
      }
    }) => {

      // 处理成功
      if (code === 200) {
        return data;
      }

      // 判断是否需要登录
      if ([401, 450].includes(code)) {
        // 跳转到登录页面
        store.commit('app/toast', '您还未登录或登录已失效,请先登录')
        store.commit('app/replacePath', '/login')
        return
      }

      // 提示错误消息
      store.commit('app/toast', msg);

      return Promise.reject({ code, data, msg });
    },
    // response error处理
    (err) => {
      store.commit('app/toast', '网络错误');
      // TODO
    }
  );

  return instance
};
