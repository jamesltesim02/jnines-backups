import BaseApi from './base'
import { QXC_URL } from '../config/config.ops'

// 14为4定玩法，13为3定玩法，12为2定玩法，11为1定玩法，
// 21为2现玩法，22为3现玩法，
// 31总和玩法，32为前2玩法，33前三玩法，34为后2玩法，35为后3玩法，36为千位大小单双，37为百位大小单双，38为十位大小单双，39为个位大小单双

const positionMap = [4, 3, 2, 1]
const optionTransfers = {
  // 定
  1: options => options.map(
    (numbers, i) => numbers.map(
      value => ({
        positionType: positionMap[i],
        positionNum: value
      })
    )
  ).flat(),
  // 现
  2: options => options.map(opt => ({positionNum: opt})),
  // 大小单双
  3: (options, type) => {
    if (type === 31) {
      return options.map(opt => ({ optionType: opt }))
    }

    return options.map(
      (numbers, i) => numbers.map(
        value => ({
          positionType: positionMap[i],
          optionType: value
        })
      )
    ).flat()
  }
}

const mutilOptions = (options, type) => {
  const index = parseInt(type / 10)
  return optionTransfers[index](options, type)
}

const randomOptions = (options, type) => {
  return options.map(
    item => item.map(
      (value, i) => {
        if (value === null || value === undefined) {
          return null
        }

        if (type === 31) {
          return ({ optionType: value })
        }

        if (type > 30) {
          return ({
            positionType: positionMap[i],
            optionType: value
          })
        }

        if (type < 20) {
          return ({
            positionType: positionMap[i],
            positionNum: value
          })
        }

        return  ({ positionNum: value })
      }
    ).filter(item => !!item)
  )
}

/**
 * 数字彩相关api
 */
export default class QxcApi extends BaseApi {

  constructor() {
    super ({ baseURL: QXC_URL })
  }

  /**
   * 投注
   *
   * @param {Object}} params 投注参数
   *  {
   *    issueNum: 期号
   *    ticketType: 订单类型 1: 单式 2: 复式
   *    orderAmount: 订单金额
   *    singleBetAmount: 单注金额
   *    betCount: 注数
   *    currency: 货币类型
   *    qTime: 下单时间
   *    gameGrounp: 玩法分组: 1 七星彩
   *    gameType: 玩法类型
   *        14为4定玩法，13为3定玩法，12为2定玩法，11为1定玩法，
   *        22为3现玩法，21为2现玩法，
   *        31总和玩法，32为前2玩法，33前三玩法，34为后2玩法，35为后3玩法，36为千位大小单双，37为百位大小单双，38为十位大小单双，39为个位大小单双
   *    oddsView: 赔率
   *    detInfo: [
   *      {
   *        positionType: 位置：4:千位，3:百位，2:十位，1:个位
   *        positionNum: 对应位置的数字
   *        optionType: 大小单双：0位双，1为单，100为大，-100为小，1000为大双，1001为大单，-1000为小双，-1001为小单
   *        odds: 赔率
   *      }
   *    ]
   *  }
   */
  bet (params, random = false) {
    return this._post(
      'lottery/lotteryBet',
      {
        issueNum: params.issue,
        ticketType: params.count > 1 ? 2 : 1,
        orderAmount: +params.amount,
        singleBetAmount: +params.amount / params.count,
        betCount: params.count,
        currency: 1,
        qTime: Date.now(),
        randomType: random ? 2 : 1,
        groupType: params.group,
        gameType: params.type,
        detInfo: {
          lotteryList: (
            random
            ? randomOptions(params.options, params.type)
            : null
          ),
          options: (
            random
            ? null
            : mutilOptions(params.options, params.type)
          )
        }
      }
    )
  }

  /** 查询期号及赔率信息 */
  getQxcInfo (groupType) {
    return this._get(
      'lottery/getIssueAndOdds',
      {
        params: { groupType }
      }
    )
  }

  /**
   * 查询开奖记录
   *
   * @param {object} params 查询条件
   *  {
   *    pageSize: 每页条数
   *    pageIndex: 页码
   *  }
   */
  getHistory (params) {
    return this._get(
      'lottery/lotteryRecord',
      { params }
    )
  }

  /**
   * 查询用户投注记录
   *
   * @param {object} params 查询条件
   *  {
   *    pageSize: 每页条数
   *    pageIndex: 页码
   *    state: 订单状态 1: 全部, 2: 已中奖, 3 未中奖, 4 待开奖
   *  }
   */
  getOrders (params) {
    return this._get(
      'lottery/userBetRecord',
      { params }
    )
  }

  /**
   * 查询订单详情
   *
   * @param {string} id 订单id
   */
  getOrderDetail (id) {
    return this._get(
      'lottery/getBetByTicketId',
      {
        params: { ticketId: id }
      }
    )
  }
}
