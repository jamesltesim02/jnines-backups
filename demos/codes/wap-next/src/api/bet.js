import axios from 'axios'

// 投注单服务器
const betUrl = window.NBServer.p_s2
// 点水服务器
const quoteUrl = window.NBServer.p_s3
// 友商平台管理服务器-用于查询注单历史
const orderUrl = window.NBServer.p_c

/**
 * 投注单请求配置信息
 */
const betConfig = {
  baseURL: betUrl,
  /**
   * response结果处理
   * 
   * @param {string} str
   *      响应结果字符串
   * 
   * @return {object} 处理结果
   */
  transformResponse:  (str) => {
    let data = JSON.parse(str)

    if(data.ec && data.ec !== 100) {
      return {
        result: data.ec,
        msg: data.msg,
        data: data.dt
      }
    }

    return {
      result: 200,
      msg: data.msg,
      data: data
    }
  }
}

/**
 * 点水请求配置
 */
const quoteConfig = {
  baseURL: quoteUrl,
  transformResponse: (str) => {
    let data = JSON.parse(str)
  
    if (data.err) {
      return {
        result: data.err,
        msg: data.rsn
      }
    }
  
    return {
      result: 200,
      msg: 'OK',
      data: data
    }
  }
}

/**
 * 投注历史请求配置
 */
const orderConfig = {
  baseURL: orderUrl,
  transformResponse: (str) => {
    let data = JSON.parse(str)
    return {
      result: data.code == 0 ? 200 : data.code,
      msg: data.message,
      data: data.data
    }
  }
}

/**
 * 查询我的注单
 * 
 * @param {object} params
 *      查询参数
 */
export const queryMybets = async (params) => {
  return axios.post(
    'mybets/mybets',
    params,
    betConfig
  )
}

/**
 *  提交投注单
 * @param {object} params
 *      投注单信息
 */
export const btbet = async (params) => {
  return axios.post(
    'bet/btbet',
    params,
    betConfig
  )
}

/**
 * 查询串关最大派彩额度
 */
export const btlimitcombo = async () => {
  return axios.post('bet/btlimitcombo', null, betConfig)
}

/**
 * 查询订单状态
 */
export const checkbets = async (params) => {
  return axios.post(
    'bet/checkbets',
    params,
    betConfig
  )
}

/**
 * 点水
 * @param {object} params
 *      点水所需参数
 */
export const quote = async (params) => {
  // 调用点水接口
  let quoteList = await axios.post(
    'quote',
    params,
    quoteConfig
  )

  // 是否没有数据
  if (!quoteList || !quoteList.length) {
    throw { result: 199 }
  }

  // 处理结果集
  return quoteList.map(v => ({
    ...v,
    atn: v.anm,
    htn: v.hnm,
    on: v.omn,
    // 0 正常, 1 暂停, 2 停盘 3 赔率已上升, 4 赔率已下降
    optionState: v.cbet ? 0 : 1
    // optionState: 4
  }))
}

/**
 * 查询历史订单列表
 */
export const findBetExtendList = async (params) => {
  return axios.post(
    'order/findBetExtendList',
    params,
    orderConfig
  )
}