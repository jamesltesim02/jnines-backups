import store from '@/store';

export const getUserinfo = () => store.state.app.userinfo || {};

export const isLoged = () => store.state.app.isLoged;

export const getToken = () => getUserinfo().token || undefined;

export const logout = () => {
  store.commit('app/setUserinfo', null);
  window.location = '/#/';
};

export const logoutWithApi = async () => {
  try {
    logout();
  } catch (e) {
    console.warn(e);
  }
};
