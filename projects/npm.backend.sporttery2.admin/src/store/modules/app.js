import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage
} from '@/utils/storage-utils';
import { storeKeys } from '@/config/config.dev';

/**
 * app相关state
 */
const state = {
  /** 用户信息 */
  userinfo: loadFromStorage(storeKeys.USERINFO),
  /** toast内容 */
  toast: null,
  /** 需要跳转到的path地址, 供非component代码中需要跳转使用 */
  toPath: null
};

/**
 * 用户相关计算属性
 */
const getters = {
  /**
   * 获取是否已登录
   * @param {object} state 自动注入的state对象
   */
  isLogin (state) {
    return !!state.userinfo;
  }
};

const mutations = {
  /**
   * 设置用户信息
   *
   * @param {object} state 当前state
   * @param {object} userinfo 用户信息
   */
  setUserinfo (state, userinfo) {
    state.userinfo = userinfo;
    if (userinfo) {
      saveToStorage(storeKeys.USERINFO, userinfo);
    } else {
      removeFromStorage(storeKeys.USERINFO);
    }
  },
  /** 更新toast */
  toast (state, toast) {
    if (typeof toast === 'string') {
      toast = {
        msg: toast,
      };
    }
    state.toast = toast;
  },
  /**
   * 转到新地址
   * @param {object|string} path 新地址
   *    如果是string则直接push到新地址
   *    如果是object:
   *    {
   *      type: 类型, replace | push
   *      path: 地址
   *    }
   */
  path (state, path) {
    state.toPath = path;
  },
  replacePath (state, path) {
    state.toPath = {
      type: 'replace',
      path
    }
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
