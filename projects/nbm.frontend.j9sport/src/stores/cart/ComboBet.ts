import { makeAutoObservable, action } from 'mobx';

import { MAX_COMBO_BET, TICKET_REMOVE_TIME, TICKET_STATUS } from "../../consts/app";

import Market from "../matchs/Market";
import Match from "../matchs/Match";
import { message } from "antd";
import collect, { CollectType } from '../../utils/collect';

enum OddsStatus {
  NORMAL = 'normal',
  UPPER = 'upper',
  LOWER = 'lower',
}

interface IComboBet {
  optionId: string
  odds: number
  status: number
  maxBet: number
  maxReturn: number
  minBet: number
  market: Market
  matchInfo: Match
  matchScore: string
  errMsg: string
  errCode: number
  betOption: string
  oddsStatus: number
  betBar: string
  baseOdds: number
  baseBetBar: string
}

interface ITicket {
  ticketId: string,
  options: IComboBet[],
  betAmount: number,
  status: any,
  errMsg: string,
  removeTime: number
  addTime: number
}

class ComboBet {
  /** 串关队列 */
  private _comboQueue: ITicket[] = []
  /** 当前购物车注单,只能有一单*/
  private _comboBet: IComboBet[] = []
  /** 当前串关 */
  private _comboBetBak: IComboBet[] = []

  constructor() {
    makeAutoObservable(this)
  }

  /** 获取当前购物篮串关 */
  get comboBet() {
    return this._comboBet
  }

  /** 修改当前购物篮串关 */
  @action
  set comboBet(comboBet) {
    this._comboBet = [...comboBet]
  }

  /** 购物车串关备份 */
  get comboBetBak() {
    return this._comboBetBak
  }

  @action
  set comboBetBak(comboBetBak) {
    this._comboBetBak = [...comboBetBak]
  }

  /** 更新串关 */
  @action
  updateComboBet(index: number, data: IComboBet) {
    this._comboBet[index] = {...data}
  }

  /** 添加串关到购物车 */
  @action
  addToComboBet(bet: any) {
    // 最大串关数
    if (this._comboBet.length >= MAX_COMBO_BET) {
      message.warning(`最大串关数${MAX_COMBO_BET}`)
      return;
    }
    // 同场比赛不能串
    const sameMatchIdx = (this._comboBet.findIndex(v => (
      v.matchInfo.matchId === bet.matchInfo.matchId
    )))
    if (sameMatchIdx !== -1) {
      this._comboBet.splice(sameMatchIdx, 1, bet)
    } else {
      this._comboBet.unshift(bet)
    }
  }

  /** 串关点水 */
  @action
  quoteComboBet(options: any, extras: any) {
    for (let opsItem of options) {
      const comboIdx = this._comboBet.findIndex(v => v.optionId === opsItem.optionId)
      if (comboIdx !== -1) {
        if (opsItem.errorCode === 0) {
          this._comboBet[comboIdx] = {
            ...this._comboBet[comboIdx],
            ...opsItem,
            ...extras,
            errCode: opsItem.errorCode,
            errMsg: opsItem.errorMsg,
            odds: opsItem.odds,
            baseOdds: opsItem.odds,
            baseBetBar: opsItem.betBar
          }
        } else {
          this._comboBet[comboIdx] = {
            ...this._comboBet[comboIdx],
            ...opsItem,
            errCode: opsItem.errorCode,
            errMsg: opsItem.errorMsg
          }
        }
      }
    }
  }

  /** 移除串关 */
  @action
  removeComboBet(optionId?: string) {
    this._comboBet = this._comboBet.filter(v => v.optionId !== optionId)
  }

  /** 删除全部串关 */
  @action
  clearComboBet() {
    this._comboBet = [] as IComboBet[]
  }

  /** 获取串关等待区 */
  get comboQueue() {
    return this._comboQueue
  }

  /** 修改串关等待区 */
  @action
  set comboQueue(queue) {
    this._comboQueue = JSON.parse(JSON.stringify(queue))
  }

  /** 将当前购物车注单加入受理区 */
  @action
  addToComboQueue(ticket: ITicket) {
    this._comboQueue.unshift(JSON.parse(JSON.stringify(ticket)))
    if (this.comboBetBak.length > 0) {
      this._comboBet = [...this._comboBetBak]
      this._comboBetBak = []
    } else {
      this.clearComboBet()
    }
  }

  /** 等待区去掉单子 */
  @action
  removeComboQueue(ticketId: string, timer?: any) {
    this._comboQueue = this._comboQueue.filter(v => v.ticketId !== ticketId)
    clearTimeout(timer)
  }

  /** 当前能否进行投注 */
  get canDoComboBet() {
    if (this.comboBet.length < 2) {
      return false;
    } else {
      return !this.comboBet.find(v => v.errCode !== 0) && !this.comboBet.find(v => v.status === -1)
    }
  }

  /** 赔率状态 */
  oddsStatus(optionId: string) {
    const bet = this._comboBet.find(v => v.optionId === optionId)

    if (bet) {
      if (!bet.oddsStatus) {
        return OddsStatus.NORMAL
      }

      if (bet.oddsStatus === 0) {
        return OddsStatus.NORMAL;
      }
      return (
        bet.oddsStatus > 0
          ? OddsStatus.UPPER
          : OddsStatus.LOWER
      );
    }
  }

  /** 获取盘口变化状态 */
  get betBarStatus() {
    return this.comboBet.find((item) => item.betBar !== item.baseBetBar)
  }

  /** 接受nt：100 状态变化 */
  receiveTicketStatus(ticketId: string, event: any) {
    let status: number, errMsg: string;
    if (event.data.errorCode === 200) {
      status = TICKET_STATUS.SUCCESS
      errMsg = '本次投注成功'
    } else {
      status = TICKET_STATUS.FAILED
      errMsg = event.data.errorMsg + ',点击重投'
    }

    this.comboQueue = this._comboQueue.map(iTicket => {
      if (
        iTicket.ticketId === ticketId
        &&
        iTicket.status === undefined
      ) {
        // 上报注单结果数据
        collect({
          type: CollectType.ORDER,
          orderNo: ticketId,
          orderResult: JSON.stringify({
            success: status === TICKET_STATUS.SUCCESS,
            msg: errMsg
          })
        });
        // 获取最新赔率盘口
        const options = iTicket.options.map((option: any) => {
          const opts = event.data.opts?.find((opt: any) => opt.optId === option.optionId)
          if (opts) {
            return {
              ...option,
              odds: opts.odds,
              betBar: opts.betbar,
              market: {
                ...option.market,
                betBar: opts.betbar,
                odds: opts.odds
              }
            }
          } else {
            return option
          }
        })
        return {
          ...iTicket,
          options,
          status,
          errMsg,
          removeTime: Date.now()
        }
      } else {
        return iTicket;
      }
    })

    // 成功才删除 失败保留注单
    if (status === TICKET_STATUS.SUCCESS) {
      const timer = setTimeout(() => {
        this.removeComboQueue(ticketId, timer)
      }, TICKET_REMOVE_TIME)
    }
  }

  /** 检查注单状态变化 */
  @action
  receiveCheckStatus(
    {
      ticketStatus,
      ticketId,
      opts
    }: {
      ticketStatus: number
      ticketId: string
      opts: Array<{ betBar: string, odds: number, optId: string }>
    }
  ) {
    let status = -1, errMsg: string;

    if ([1, 3].includes(ticketStatus)) {
      // 状态1，3投注成功
      status = TICKET_STATUS.SUCCESS
      errMsg = '本次投注成功'
    } else if ([0, 11, 4].includes(ticketStatus)) {
      // 状态0，11，4失败
      status = TICKET_STATUS.FAILED
      errMsg = '本次投注失败,点击重投'
    }

    this.comboQueue = this._comboQueue.map(iTicket => {
      if (iTicket.ticketId === ticketId) {
        // 获取最新赔率盘口
        const options = iTicket.options.map((option: any) => {
          if (opts) {
            const opt = opts.find((opt: any) => opt.optId === option.optionId)
            if (opt) {
              return {
                ...option,
                odds: opt.odds,
                betBar: opt.betBar,
                market: {
                  ...option.market,
                  betBar: opt.betBar,
                  odds: opt.odds
                }
              }
            }
          } else {
            return option
          }
        })
        return {
          ...iTicket,
          options,
          status,
          errMsg,
          removeTime: Date.now()
        }
      } else {
        return iTicket;
      }
    })

    if (status === TICKET_STATUS.SUCCESS) {
      const timer = setTimeout(() => {
        this.removeComboQueue(ticketId, timer);
      }, TICKET_REMOVE_TIME);
    }
  }
}


export default new ComboBet()

