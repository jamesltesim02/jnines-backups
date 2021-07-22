import { makeAutoObservable } from "mobx";
import { CacheKeys, TICKET_STATUS } from "../../consts/app";
import Market from "../matchs/Market";
import Match from "../matchs/Match";
import { saveToStorage } from "../../utils/StorageUtils";
import notification from "../../components/common/Notification";
import collect, { CollectType } from "../../utils/collect";

interface ICurrentBet {
  optionId: string
  odds: number
  status: number
  maxBet: number
  maxReturn: number
  minBet: number
  matchScore: string
  amount: number
  betOption: string
  oddsStatus: number
  market: Market
  matchInfo: Match
  betTime?: number
  baseOdds: number
  baseBetBar? : string
  betBar: string
}

interface IRecord {
  ticketId: string,
  options: ICurrentBet,
  status?: number,
  errMsg?: string,
  betTime: number,
  betAmount: number
}

class SingleBet {
  constructor() {
    makeAutoObservable(this)
  }

  /** 当前购物注单 */
  current = {} as ICurrentBet
  /** 当前记录 */
  record: IRecord[] = []

  serialize () {
    const _record = this.record.map((item) => {
      const {options} = item

      if (item.status === undefined) {
        return {
          ticketId: item.ticketId,
          status: item.status,
          options: {
            betOption: options.betOption,
            matchScore: options.matchScore,
            odds: options.odds,
            matchInfo: {
              matchName: options.matchInfo.matchName
            },
            market: {
              marketType: options.market.marketType,
              marketGroup: options.market.marketGroup,
              betBar: options.market.betBar
            }
          }
        }
      }
      return undefined;
    })

    saveToStorage(
      CacheKeys.STORE_CART_RECORD,
      _record
    )
  }

  /** 加入单式 */
  addSingleBet(val: ICurrentBet) {
    this.current = {...val}
  }

  /** 移除单式 */
  removeSingleBet() {
    this.current = {} as ICurrentBet
  }

  /** 添加到记录 */
  addToRecord(record: IRecord) {
    this.record = [JSON.parse(JSON.stringify(record)), ...this.record]
    this.serialize()
  }

  /** 移除记录 */
  removeRecord(ticketId: string) {
    this.record = this.record.filter(v => v.ticketId !== ticketId);
    this.serialize()
  }

  /** 推送赔率变化 */
  get oddsStatus() {

    if (!this.current.oddsStatus) {
      return 'normal';
    }
    return (
      this.current.oddsStatus > 0
        ? 'upper'
        : 'lower'
    );
  }

  /** 接受nt：100 状态变化 */
  receiveTicketStatus(
    ticketId: string,
    status: number,
    errMsg: string | undefined,
    newData: {betBar: string, odds: number}
    ) {

    this.record = this.record.map(record => {
      if (
        record.ticketId === ticketId
        &&
        record.status === undefined
      ) {
        notification.openSingle(record.options,status)
        // 上报注单结果数据
        collect({
          type: CollectType.ORDER,
          orderNo: ticketId,
          orderResult: JSON.stringify({
            success: status === TICKET_STATUS.SUCCESS,
            msg: errMsg
          })
        });
        console.log(record,newData)
        return {
          ...record,
          status,
          errMsg,
          options: {
            ...record.options,
            ...newData
          }
        }
      } else {
        return record;
      }
    })

    
  }
}

export default new SingleBet();