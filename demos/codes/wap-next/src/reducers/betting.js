import NBConstant from '@/assets/js/base'
import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage
} from '@/utils/StorageUtils'

/**
 * betting的action类型列表
 */
const actionTypes = {
  /**
   * 添加
   */
  ADD_BET: 'ADD_BET',
  /**
   * 重新设置
   */
  SET_BET: 'SET_BET',
  /**
   * 更新
   */
  UPDATE_BET: 'UPDATE_BET',
  /**
   * 删除
   */
  DELETE_BET: 'DELETE_BET',
  /**
   * 清空
   */
  CLEAR_BET: 'CLEAR_BET',
  /**
   * 默认动作
   */
  DEFAULT: 'DEFAULT'
}

/**
 * 默认betting列表
 */
const defaultState = loadFromStorage(NBConstant.MOBILE_BETTING_DATA, [])

/**
 * betting相关的reducer
 */
const reducers = {
  /**
   * 添加bet信息
   *
   * @param {array} state
   *      当前的state对象
   * @param {object} {data}
   *      将要添加的bet信息
   */
  [actionTypes.ADD_BET] (state, {data}) {
    let newState = [data, ...state]
    saveToStorage(NBConstant.MOBILE_BETTING_DATA, newState)
    return newState
  },
  /**
   * 重新设置bet信息
   * @param {array} state
   *      当前的state对象
   * @param {object} {bettings}
   *      将要重新设置的bet信息
   */
  [actionTypes.SET_BET] (state, {bettings}) {
    let k2i = {}
    state.forEach((v, i) => k2i[v.oid]=i)

    let newState = bettings.map(bet => {
      return {
        ...state[k2i[bet.oid]],
        ...bet
      }
    })

    saveToStorage(NBConstant.MOBILE_BETTING_DATA, newState)

    return newState
  },
  /**
   * 更新bet信息
   *
   * @param {array} state
   *      当前的state对象
   * @param {array} {bettings}
   *      将要更新的投注单信息列表
   */
  [actionTypes.UPDATE_BET] (state, {bettings}) {
    if(
      !state || !state.length 
      || !bettings || !bettings.length
    ) {
      return []
    }

    // 构造oid到index的映射
    let newState = [...state]
    let k2i = {}
    newState.forEach((v, i) => k2i[v.oid]=i)

    // 循环更新投注单列表中对应的项
    bettings.forEach(v => {
      let index = k2i[v.oid]
      if (index == -1) {
        return
      }

      newState[index] = {
        ...newState[index],
        ...v
      }
    })

    saveToStorage(NBConstant.MOBILE_BETTING_DATA, newState)

    return newState
  },
  /**
   * 删除bet信息
   *
   * @param {array} state
   *      当前的state对象
   * @param {string} {oid}
   *      将要删除的投注单oid
   */
  [actionTypes.DELETE_BET] (state, {oid}) {
    if(!state || !state.length) {
      return []
    }

    // 获取位置
    let index = state.findIndex(v => v.oid == oid)
    if (index == -1) {
      return
    }
    
    // 复制新数组并删除元素
    let newState = [...state]
    newState.splice(index, 1)
    saveToStorage(NBConstant.MOBILE_BETTING_DATA, newState)

    return newState
  },
  /**
   * 清空bet列表
   */
  [actionTypes.CLEAR_BET] () {
    removeFromStorage(NBConstant.MOBILE_BETTING_DATA)
    return []
  },
  /**
   * 默认bet信息,没有任何动作时直接返回state数据
   *
   * @param {array} state
   *      当前的state对象
   */
  [actionTypes.DEFAULT] (state) {
    return state
  }
}

/**
 * 对外提供的actions
 */
export const bettingActions = {
  /**
   * 添加投注单
   * 
   * @param {object} betData
   *      将要添加的betData
   */
  addBetting (data) {
    return {type: actionTypes.ADD_BET, data}
  },
  /**
   * 重新设置投注单列表
   * @param {object} bettings
   *      将要重新设置的列表
   */
  setBetting (bettings) {
    return {type: actionTypes.SET_BET, bettings}
  },
  /**
   * 更新投注单
   * 
   * @param {array} bettings
   *      将要更新的投注单列表
   */
  updateBetting (bettings) {
    return {type: actionTypes.UPDATE_BET, bettings}
  },
  /**
   * 删除投注单
   * @param {number} index
   *      将要删除的投注单索引
   */
  deleteBetting (oid) {
    return {type: actionTypes.DELETE_BET, oid}
  },
  /**
   * 清空投注单
   */
  clearBetting () {
    return {type: actionTypes.CLEAR_BET}
  }
}

export default (state = defaultState, action) => {
  return (reducers[action.type] || reducers[actionTypes.DEFAULT]) (state, action)
}