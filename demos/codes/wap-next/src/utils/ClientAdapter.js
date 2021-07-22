import store from '@/store'
import {globalActions} from '@/reducers/global'

/**
 * 商户默认配置,商户接入传入的自定义配置将会覆盖此配置
 */
const clientConfig = {
  /**
   * 未登录回调
   */
  unLogin (fn) {

    fn(data);

    console.error('当前未登录, 但客户端并未实现登录回调.请参考接入文档,在NBBet.init中传入unLogin回调函数实现.')
  },
  /**
   * 投注成功回调
   */
  betSuccess () {
    console.warn('投注成功回调')
  },
  /**
   * 投注失败回调
   */
  betFail () {
    console.warn('投注失败回调')
  }
};

/**
 * 将商户接入时传入的自定义配置覆盖默认配置
 *
 * @param {obj} config
 *    商户自定义配置
 */
export function setClientConfig (config) {
  Object.assign(clientConfig, config)
}

/**
 * 获取商户自定义配置参数
 *
 * @param {string} key
 *    参数名
 */
export function getClientConfig (key) {
  return clientConfig[key]
}

/**
 * 调用商户的登录回调
 */
export function callUnLogin () {
  return new Promise(resolve => {
    clientConfig.unLogin(() => {
      store.dispatch(globalActions.refreshLogin())
      resolve()
    })
  })
}

/**
 * 调用商户的投注成功回调
 * @param {object} betData
 *    投注信息
 */
export function callBetSuccess (betData) {
  return new Promise(resolve => {
    clientConfig.betSuccess(betData)
    resolve()
  })
}

/**
 * 调用商户的投注失败回调
 * @param {number} errorCode
 *    失败的错误码
 */
export function callBetFail (errorCode) {
  return new Promise(resolve => {
    clientConfig.betFail(errorCode, flag => !flag && resolve(true))
  })
}
