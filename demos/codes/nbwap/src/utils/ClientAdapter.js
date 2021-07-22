/**
 * 商户默认配置,商户接入传入的自定义配置将会覆盖此配置
 */
const clientSettings = {
  /**
   * 未登录回调
   */
  unLogin (fn) {
    console.error('当前未登录, 但客户端并未实现登录回调.请参考接入文档,在NBBet.init中传入unLogin回调函数实现.')
  },
  /**
   * 投注成功回调
   */
  betSuccess () {
    console.warn('投注成功回调')
  }
}

/**
 * 将商户接入时传入的自定义配置覆盖默认配置
 *
 * @param {obj} settings
 *    商户自定义配置
 */
export function setClientSettings (settings) {
  Object.assign(clientSettings, settings)
}

/**
 * 获取商户自定义配置参数
 *
 * @param {string} key
 *    参数名
 */
export function getClientSettings (key) {
  return clientSettings[key]
}

/**
 * 调用商户的登录回调
 */
export function callUnLogin () {
  return new Promise((resolve) => {
    clientSettings.unLogin(resolve)
  })
}

/**
 * 调用商户的投注成功回调
 */
export function callBetSuccess (betData) {
  return new Promise((resolve) => {
    clientSettings.betSuccess(betData)
    resolve()
  })
}
