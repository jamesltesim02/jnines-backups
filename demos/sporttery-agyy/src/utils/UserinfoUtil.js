import store from '@/store';
import { agLogout } from '@/api/portalAgyy';

export const getUserinfo = () => store.state.app.userinfo || {};

export const isLoged = () => store.state.app.isLoged;

export const getToken = () => getUserinfo().token || '';

export const logout = () => {
  store.commit('app/setUserinfo', null);
  window.location = '/#/login';
};

export const logoutWithApi = async () => {
  try {
    const logoutResult = await agLogout();
    console.log(logoutResult);
    logout();
  } catch (e) {
    console.warn(e);
  }
};
