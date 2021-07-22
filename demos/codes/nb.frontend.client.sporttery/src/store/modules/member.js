import store from '@/store';
import appConfig from '@/config/business.config';
import { StorageKey } from '@/config/constants';
import { saveToStorage, getCacheData } from '@/utils/StorageUtil';
import { getMemberInfo } from '@/api/activity';

const memberState = {
  memberInfo: {},
  msgNotify: false,
};
const mutations = {
  setMemberInfo(state, memberInfo) {
    const memInfo = memberInfo || null;
    saveToStorage(StorageKey.MEMBER_INFO_KEY, memInfo);
    state.memberInfo = memInfo;
  },
  setMsgNotify(state, msgNotify) {
    state.msgNotify = msgNotify;
  },
};

const actions = {
  async loadMemberInfo({ commit }) {
    const {
      isLoged,
      userinfo,
    } = store.state.app;
    if (!isLoged || !userinfo.nbUser) {
      return;
    }
    const memberInfo = await getCacheData(
      StorageKey.MEMBER_INFO_KEY,
      appConfig.memberInfoCacheTime,
      async () => getMemberInfo(userinfo.nbUser),
    );
    commit('setMemberInfo', {
      nickName: userinfo.memberAccount,
      ...memberInfo,
    });
    store.commit('app/updateUserinfo', {
      ...userinfo,
      ...memberInfo,
    });
  },
};

export default {
  namespaced: true,
  state: memberState,
  mutations,
  actions,
};
