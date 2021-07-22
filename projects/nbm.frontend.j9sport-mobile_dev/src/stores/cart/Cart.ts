import { makeAutoObservable } from "mobx";
import { PushEvent } from "../../components/push/PushConnection";
import SingleBetStore from "./SingleBet";
import ComboBetStore from "./ComboBet";
import { TICKET_STATUS } from "../../consts/app";

class Cart {
  constructor() {
    makeAutoObservable(this)
  }

  showSidebar = false

  ticketCount = 0

  ticketCountTip = false

  /** 显示/隐藏投注栏 */
  toggleSidebar(state?: boolean) {

    if (this.showSidebar) {
      // 每次关闭购物车，移除当前单式注单
      SingleBetStore.removeSingleBet()
      // 清理单式串关 已接受推送数据
      SingleBetStore.record = SingleBetStore.record.filter(v => v.status === undefined)
      // 存入缓存
      SingleBetStore.serialize()
      // 删除已成功注单
      ComboBetStore.comboQueue = ComboBetStore.comboQueue.filter(item => item.status !== 1)
    }
    if (state === undefined) {
      this.showSidebar = !this.showSidebar
    }else {
      this.showSidebar = state
    }
  }

  /** 接受推送 */
  onDataChange(event: PushEvent) {

    // nt100
    if (event.nt === 100) {

      // 如果投注成功, 添加成功数量
      if (event.data?.errorCode === 200) {
        this.ticketCount = this.ticketCount + 1;
        this.ticketCountTip = true
      }

      let status: number, errMsg: string | undefined;
      if (event.data?.errorCode === 200) {
        status = TICKET_STATUS.SUCCESS
        errMsg = '投注成功'
      } else {
        status = TICKET_STATUS.FAILED
        errMsg = event.data?.errorMsg
      }
      // 单式推送
      const single = SingleBetStore.record.find(val => val.ticketId === event.data?.ticketId)
      if (single) {
        SingleBetStore.receiveTicketStatus(single.ticketId, status, errMsg)
      }
      // 串关推送
      const combo = ComboBetStore.comboQueue.find(val => val.ticketId === event.data?.ticketId)
      if (combo) {
        ComboBetStore.receiveTicketStatus(combo.ticketId as string, status, errMsg)
      }
    }

    // nt2 赔率或状态变化
    if (event.nt === 2) {

      event.data?.mks?.forEach((market: { ops: any[]; }) => {
        market.ops.forEach(opt => {
          // 单式
          if (opt.oid === SingleBetStore.current.optionId) {
            // 单式串关bst为0删除
            if (opt.bst === 0) {
              this.toggleSidebar()
              SingleBetStore.removeSingleBet()
            }
            // 更新到单式
            SingleBetStore.current = {
              ...SingleBetStore.current,
              odds: opt.odds,
              status: opt.bst,
              oddsStatus: opt.odds - SingleBetStore.current.baseOdds
            }
          }
          // 当前没有串关
          if (!ComboBetStore.current) {
            return ;
          }
          // 串关
          const comboIndex = ComboBetStore.current.options.findIndex(({optionId}) =>
            opt.oid === optionId
          )

          if (comboIndex !== -1) {
            // 串关bst为0时删除
            if (opt.bst === 0) {
              ComboBetStore.removeComboBet(opt.optionId)
            } else {
              ComboBetStore.updateComboBet(comboIndex, {
                ...ComboBetStore.current.options[comboIndex],
                odds: opt.odds,
                status: opt.bst,
                oddsStatus: opt.odds - ComboBetStore.current.options[comboIndex].baseOdds
              })
            }
          }
        })
      })
    }
  }

  /** 推送数据 */
  get pushData(): Array<{ matchId: string, marketId: string, optionId: string }> {

    let _pushData: { matchId: string; marketId: string; optionId: string; }[] = []

    // 推送串关数据
    if (ComboBetStore.current && ComboBetStore.current.status === undefined) {
      _pushData = ComboBetStore.current?.options.map(
        ({
           optionId,
           matchInfo: {matchId},
           market: {marketId}
         }) => ({
          matchId,
          marketId,
          optionId
        })
      )
    }
    // 推送单式数据
    if (SingleBetStore.current.optionId) {
      const {
        optionId,
        matchInfo: {matchId},
        market: {marketId}
      } = SingleBetStore.current
      _pushData.push({
        optionId,
        matchId,
        marketId
      })
    }
    return _pushData
  }

}

export default new Cart();