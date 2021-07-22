import {makeAutoObservable, action} from 'mobx';
import {TICKET_STATUS, TICKET_REMOVE_TIME} from "../../consts/app";
import collect, { CollectType } from '../../utils/collect';

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
  baseOdds: number
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
  betBar: string
  baseBetBar: string
}

interface ITicket {
  ticketId: string,
  returnAmount: number,
  options: ICurrentBet,
  status: number,
  errMsg: string,
  betAmount: number,
  removeTime: number
  addTime: number
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
    this._waitingQueue = [...JSON.parse(JSON.stringify(que))]
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
    this._waitingQueue = [JSON.parse(JSON.stringify(ticketBet)) as ITicket, ...this._waitingQueue]
    this.removeSingleBet()
  }

  /** 将某一队列中注单移除 */
  @action
  removeQueue(ticketId: string, timer?: any) {
    this._waitingQueue = this._waitingQueue.filter(v => v.ticketId !== ticketId);
    clearTimeout(timer);
  }

  get betBarStatus () {
    return this.singleBet.betBar === this.singleBet.baseBetBar
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
    const {data} = event
    if (data.errorCode === 200) {
      status = TICKET_STATUS.SUCCESS
      errMsg = '本次投注成功'
    } else {
      status = TICKET_STATUS.FAILED
      errMsg = data.errorMsg
    }

    this.waitingQueue = this._waitingQueue.map(iTicket => {
      if (
        iTicket.ticketId === ticketId
        &&
        iTicket.status === undefined
      ) {
        // 获取最新的赔率和盘口
        const options = {
          ...iTicket.options,
          odds: data.opts[0].odds,
          betBar: data.opts[0].betbar,
        }
        // 上报注单结果数据
        collect({
          type: CollectType.ORDER,
          orderNo: ticketId,
          orderResult: JSON.stringify({
            success: status === TICKET_STATUS.SUCCESS,
            msg: errMsg
          })
        });

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

    const timer = setTimeout(() => {
      this.removeQueue(ticketId, timer);
    }, TICKET_REMOVE_TIME);
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
      opts: Array<{betBar: string,odds: number,optId: string}>
    }
  ) {
    let status: number, errMsg: string;
    if ([1,3].includes(ticketStatus)) {
      // 状态1，3投注成功
      status = TICKET_STATUS.SUCCESS
      errMsg = '本次投注成功'
    }else if ([11,4].includes(ticketStatus)) {
      // 状态0，11，4失败
      status = TICKET_STATUS.FAILED
      errMsg = '本次投注失败'
    }

    this.waitingQueue = this._waitingQueue.map(iTicket => {
      if (
        iTicket.ticketId === ticketId
        &&
        iTicket.status === undefined
      ) {
        let options: any
        if (opts) {
          options = {
            ...iTicket.options,
            odds: opts[0].odds,
            betBar: opts[0].betBar
          }
        }

        return {
          ...iTicket,
          options: options || iTicket.options,
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