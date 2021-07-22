import NBConstant from '@/assets/js/base'
import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage
} from '@/utils/StorageUtils'

/**
 * action类型列表
 */
const actionTypes = {
  /**
   * 刷新登录状态
   */
  REFRESH_LOGIN: 'REFRESH_LOGIN',
  /**
   * 退出登录
   */
  LOG_OUT: 'LOG_OUT',
  /**
   * 更新配置项
   */
  UPDATE_CONFIG: 'UPDATE_CONFIG',
  /**
   * 修改投注弹窗状态
   * 0: 不弹窗, 1: 弹小窗, 2: 弹大窗
   */
  UPDATE_BETTING_DIALOG: 'UPDATE_BETTING_DIALOG',
  /**
   * 修改当前语言
   */
  UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
  /**
   * 默认动作
   */
  DEFAULT: 'DEFAULT'
}

/**
 * 当前登录用户信息
 */
const currentUser = loadFromStorage(NBConstant.NB_MOBILE_USER, null)
/**
 * 平台配置信息
 * TODO 默认值从base.js配置中获取
 */
const config = loadFromStorage(NBConstant.platform_settings, {
  // 当前语言环境
  'nb_language': NBConstant.plate_config.nb_language,
  // 视图类型  1: 亚洲视图, 2: 标准视图
  'nb_viewType': NBConstant.plate_config.nb_viewType,
  // 赔率类型 1: 标准盘 3: 香港盘
  'nb_odds_selset' : 1,
  // 接受赔率变化, 0 = 不接收赔率变化， 1 = 接收更高赔率， 2 = 接收所有赔率变化
  'nb_odds_ac': 2,
  // 当前使用的货币
  'nb_currency': 'RMB',
  // 客户端类型 1 PC, 2 手机
  'nb_client_type': 2,
  // 串关限额
  'nb_series_limit': null,
  // 默认投注额
  'nb_default_bet': 100,
  // 获取语言资源
  'locale': null
})


/**
 * 默认state
 */
const defaultState = {
  /**
   * 当前用户信息
   */
  currentUser,
  /**
   * 是否已经登录,true | false
   */
  isLoged: !!currentUser,
  /**
   * 平台配置信息,包含语言,视图类型 等参数
   */
  config: config,
  /**
   * 弹窗状态
   * 0: 不弹窗, 1: 弹窗
   */
  bettingDialog: 0
}

/**
 * betting相关的reducer
 */
const reducers = {
  /**
   * 刷新当前用户登录信息
   * @param {object} state
   *      当前的state对象
   */
  [actionTypes.REFRESH_LOGIN](state) {
    let currentUser = loadFromStorage(NBConstant.NB_MOBILE_USER, null)

    return {
      ...state,
      currentUser,
      isLoged: !!currentUser
    }
  },
  /**
   * 退出登录
   * 
   * @param {object} state
   *      当前的state对象
   */
  [actionTypes.LOG_OUT](state) {

    removeFromStorage(NBConstant.NB_MOBILE_USER)

    return {
      ...state,
      currentUser: null,
      isLoged: false
    }
  },
  /**
   * 更新配置项
   */
  [actionTypes.UPDATE_CONFIG](state, { newConfig }) {
    let newState = {
      ...state,
      config: {
        ...state.config,
        ...newConfig
      }
    }

    saveToStorage(NBConstant.platform_settings, newState.config)

    return newState
  },
  /**
   * 修改投注弹窗状态
   */
  [actionTypes.UPDATE_BETTING_DIALOG] (state, {dialogType}) {
    return {
      ...state,
      bettingDialog: dialogType
    }
  },
  /**
   * 修改当前语言
   */
  [actionTypes.UPDATE_LANGUAGE] (state, {language, locale}) {
    let newState = {
      ...state,
      config: {
        ...state.config,
        nb_language: language
      },
      locale
    }

    console.log(newState)

    saveToStorage(NBConstant.platform_settings, newState.config)

    return newState
  },
  /**
   * 默认bet信息,没有任何动作时直接返回state数据
   *
   * @param {object} state
   *      当前的state对象
   */
  [actionTypes.DEFAULT](state) {
    return state
  }
}
/**
 * 对外提供的actions
 */
export const globalActions = {
  /**
   * 刷新登录状态,通常为商户登录后的回调
   *
   * @param {object} userInfo
   *      登录后的用户信息
   */
  refreshLogin() {
    return {
      type: actionTypes.REFRESH_LOGIN
    }
  },
  /**
   * 更新平台配置项
   * 
   * @param {object} newConfig
   *      将要更新的值
   */
  updateConfig(newConfig) {
    return {
      type: actionTypes.UPDATE_CONFIG,
      newConfig
    }
  },
  /**
   * 修改投注弹窗类型
   * @param {number} type
   *      投注弹窗类型 0: 不弹窗, 1: 弹窗
   */
  updateBettingDialog(dialogType) {
    return {
      type: actionTypes.UPDATE_BETTING_DIALOG,
      dialogType
    }
  },
  /**
   * 修改当前语言
   * @param {object} languageInfo
   *      将要修改到的语言信息包含 language和locale
   */
  updateLanguage (languageInfo) {
    return {
      type: actionTypes.UPDATE_LANGUAGE,
      ...languageInfo
    }
  },
  /**
   * 退出登录
   */
  logOut() {
    return {
      type: actionTypes.LOG_OUT
    }
  }
}

export default (state = defaultState, action) => {
  return (reducers[action.type] || reducers[actionTypes.DEFAULT])(state, action)
}

