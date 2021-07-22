import {makeAutoObservable, action} from 'mobx';
import {TICKET_STATUS, TICKET_REMOVE_TIME} from "../../consts/app";

import Market from "../matchs/Market";
import Match from "../matchs/Match";

enum OddsStatus {
  NORMAL = 'normal',
  UPPER = 'upper',
  LOWER = 'lower',
}

interface ICurrentBet {
  optionId: string
  odds: number
  status: number
  maxBet: number
  maxReturn: number
  minBet: number
  market: Market
  matchInfo: Match
  matchScore: string
  amount: number
  betOption: string
  oddsStatus: number
}

interface ITicket {
  ticketId: string,
  returnAmount: number,
  options: ICurrentBet,
  status: number,
  errMsg: string,
  betAmount: number,
  removeTime: number
}

class SingleBet {
  /** 等待投注结果队列 */
  private _waitingQueue: ITicket[] = []
  /** 当前购物车注单,只能有一单*/
  private _singleBet = {} as ICurrentBet
  /** 全屏投注提交成功版本号 */
  private _fullbetVersion = 0;

  constructor() {
    makeAutoObservable(this)
  }

  /** 更新当前单式注单 */
  @action
  set singleBet(singleBet: ICurrentBet) {
    this._singleBet = singleBet
  }

  /** 获取当前单式注单 */
  get singleBet() {
    return this._singleBet
  }

  /** 获取等待的队列 */
  get waitingQueue() {
    return this._waitingQueue
  }

  /** 修改等待队列 */
  @action
  set waitingQueue(que) {
    this._waitingQueue = [...que]
  }

  @action
  /** 移除当前注单 */
  removeSingleBet() {
    this._singleBet = {} as ICurrentBet
  }

  /** 将当前单式注单加入队列 */
  @action
  set addToQueue(ticketInfo: object) {
    const ticketBet = {
      options: {...this._singleBet},
      ...ticketInfo
    }
    this._waitingQueue = [ticketBet as ITicket, ...this._waitingQueue]
    this.removeSingleBet()
  }

  /** 将某一队列中注单移除 */
  @action
  removeQueue(ticketId: string, timer?: any) {
    this._waitingQueue = this._waitingQueue.filter(v => v.ticketId !== ticketId);
    clearTimeout(timer);
  }

  /** 推送赔率变化 */
  get oddsStatus() {

    if (!this._singleBet.oddsStatus) {
      return OddsStatus.NORMAL;
    }

    if (this._singleBet.oddsStatus === 0) {
      return OddsStatus.NORMAL;
    }
    return (
      this.singleBet.oddsStatus > 0
        ? OddsStatus.UPPER
        : OddsStatus.LOWER
    );
  }

  @action
  /** 接受nt：100 状态变化 */
  receiveTicketStatus(ticketId: string, event: any) {
    let status: number, errMsg: string;
    if (event.data.errorCode === 200) {
      status = TICKET_STATUS.SUCCESS
      errMsg = '本次投注成功'
    } else {
      status = TICKET_STATUS.FAILED
      errMsg = event.data.errorMsg
    }

    this.waitingQueue = this._waitingQueue.map(iTicket => {
      if (iTicket.ticketId === ticketId) {
        return {
          ...iTicket,
          status,
          errMsg,
          removeTime: Date.now()
        }
      } else {
        return iTicket;
      }
    })

    const timer = setTimeout(() => {
      this.removeQueue(ticketId, timer);
    }, TICKET_REMOVE_TIME);
  }

  /** 检查注单状态变化 */
  @action
  receiveCheckStatus(ticketId: string, status: number, errMsg: string) {

    this.waitingQueue = this._waitingQueue.map(iTicket => {
      if (
        iTicket.ticketId === ticketId &&
        iTicket.status === undefined
      ) {
        return {
          ...iTicket,
          status,
          errMsg,
          removeTime: Date.now()
        }
      } else {
        return iTicket;
      }
    })

    const timer = setTimeout(() => {
      this.removeQueue(ticketId, timer);
    }, TICKET_REMOVE_TIME);

  }

  @action
  updateFullbetVersion() {
    this._fullbetVersion = this._fullbetVersion + 1;
  }

  get fullbetVersion() {
    return this._fullbetVersion;
  }
}

export default new SingleBet()