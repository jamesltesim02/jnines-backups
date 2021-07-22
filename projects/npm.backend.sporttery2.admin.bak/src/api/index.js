import Axios from 'axios';
import store from '@/store';

import opsConfig from '@/config/config.ops';


export default (conf = {}) => {
  const instance = Axios.create({
    baseURL: opsConfig.API_URL,
    ...conf
  });
  instance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

  instance.interceptors.request.use(
    // request拦截
    (reqConfig) => {
      // 统一设置登陆token
      if (store.state.app.isLogin) {
        reqConfig.headers.Authorization = store.state.app.token;
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

      // TODO 判断是否需要登录
      if (code === 450) {
        // TODO 跳转到登录页面
      }

      // TODO 提示错误消息
      console.log(msg);

      return Promise.reject({ code, data, msg });
    },
    // response error处理
    (err) => {
      // TODO
    }
  );

  return instance
};
