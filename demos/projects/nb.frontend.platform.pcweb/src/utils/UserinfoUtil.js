import store from '@/store';
import router from '@/router';

export const getUserinfo = () => store.state.app.userinfo || {};

export const getToken = () => getUserinfo().token || '';

export const logout = () => {
  store.commit('app/setUserinfo', null);
  // 转到首页
  router.replace('/');
};
