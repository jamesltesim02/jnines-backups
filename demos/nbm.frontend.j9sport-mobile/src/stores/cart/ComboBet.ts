import { makeAutoObservable } from "mobx";
import { MAX_COMBO_BET } from "../../consts/app";
import Market from "../matchs/Market";
import Match from "../matchs/Match";

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
  baseOdds: number
}

interface ITicket {
  ticketId?: string,
  options: IComboBet[],
  betAmount?: number,
  betTime?: number,
  status?: any,
  errMsg?: string,
}

class ComboBet {

  constructor() {
    makeAutoObservable(this)
  }

  /** 所有串关标签队列 */
  comboQueue: ITicket[] = []

  /** 当前串关tab标签索引 */
  comboTabIdx = 0

  /** 当前串关tab */
  get current() {

    if (!this.comboQueue[this.comboTabIdx]) {
      this.comboTabIdx = this.comboQueue.length - 1
    }

    return this.comboQueue[this.comboTabIdx]
  }

  set current(ticket: ITicket) {
    this.comboQueue[this.comboTabIdx] = ticket
  }

  /** 添加串关 */
  addComboBet(comboBet: any) {

    if (!this.current) {
      this.comboQueue = [{options: [comboBet]}]
      return;
    }

    if (this.current.ticketId) {
      this.comboQueue = [...this.comboQueue, {options: [comboBet]}]
      this.comboTabIdx = this.comboQueue.length - 1
    }

    // 最大串关数
    if (this.current.options.length > MAX_COMBO_BET) {
      return;
    }
    // 同场比赛不能串
    const sameMatchIdx = this.current.options.findIndex(v => v.matchInfo.matchId === comboBet.matchInfo.matchId)

    if (sameMatchIdx !== -1) {
      this.comboQueue[this.comboTabIdx].options.splice(sameMatchIdx, 1, comboBet)
    } else {
      this.comboQueue[this.comboTabIdx].options.unshift(comboBet)
    }
  }

  /** 移除串关项 */
  removeComboBet(optionId: string) {
    this.comboQueue[this.comboTabIdx].options = this.comboQueue[this.comboTabIdx].options.filter(v => v.optionId !== optionId)
    this.comboQueue = this.comboQueue.filter(v => v.options.length !== 0)
  }

  /** 移除串关注单 */
  removeComboQueue(index: number) {
    this.comboQueue.splice(index, 1)
  }

  /** 更新串关 */
  updateComboBet(index: number, data: IComboBet) {
    this.comboQueue[this.comboTabIdx].options[index] = {...data}
  }

  /** 串关点水 */
  quoteComboBet(options: any, extras: any) {
    for (let opsItem of options) {
      const comboIdx = this.current.options.findIndex(v => v.optionId === opsItem.optionId)
      if (comboIdx !== -1) {
        if (opsItem.errorCode === 0) {
          this.comboQueue[this.comboTabIdx].options[comboIdx] = {
            ...this.comboQueue[this.comboTabIdx].options[comboIdx],
            ...opsItem,
            ...extras,
            errCode: opsItem.errorCode,
            errMsg: opsItem.errorMsg,
            odds: opsItem.odds
          }
        } else {
          this.comboQueue[this.comboTabIdx].options[comboIdx] = {
            ...this.comboQueue[this.comboTabIdx].options[comboIdx],
            errCode: opsItem.errorCode,
            errMsg: opsItem.errorMsg
          }
        }
      }
    }
  }

  /** 接受nt：100 状态变化 */
  receiveTicketStatus(ticketId: string, status: number, errMsg: string | undefined) {

    this.comboQueue = this.comboQueue.map(iTicket => {
      if (
        iTicket.ticketId === ticketId
        &&
        iTicket.status === undefined
      ) {
        return {
          ...iTicket,
          status,
          errMsg,
        }
      } else {
        return iTicket;
      }
    })
  }
  /** 重投 */
  resetTicketStatus(ticketId?: string) {
    this.comboQueue = this.comboQueue.map(iTicket => {
      if (iTicket.ticketId === ticketId) {
        return {
          options:iTicket.options
        }
      }else {
        return iTicket
      }
    })
  }
}

export default new ComboBet();