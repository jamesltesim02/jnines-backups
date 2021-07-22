import {makeAutoObservable, action} from 'mobx';
import {PushEvent} from "../../components/push/PushConnection";
import SingleBetStore from "./SingleBet";
import ComboBetStore from "./ComboBet";
import member from "../member";

export enum TAB_INDEX {
	SINGLE = 0,
	COMBO = 1
}

class Cart {
	private _currentTab:TAB_INDEX = TAB_INDEX.SINGLE

	private _ticketTab = 'cart'

	private _ticketCount = 0;

	constructor() {
		makeAutoObservable(this)
	}
	get currentTab() {
		return this._currentTab
	}
	@action
	set currentTab(tabindex) {
		this._currentTab = tabindex
	}
	@action
	cartToggleTo(tabindex: TAB_INDEX) {
		this._currentTab = tabindex
	}

	get ticketTab() {
		return this._ticketTab
	}

	@action
	set ticketTab(key: string) {
		this._ticketTab = key
	}

	get ticketCount () {
		return this._ticketCount;
	}

	onDataChange(event: PushEvent) {

		// nt100
		if (event.nt === 100) {

			// 单式投注
			const single = SingleBetStore.waitingQueue.find(val => val.ticketId === event.data?.ticketId)
			// 串关投注
			const combo = ComboBetStore.comboQueue.find(val=> val.ticketId === event.data?.ticketId)

			// 如果投注成功, 添加成功数量
			if (event.data?.errorCode === 200) {
				this._ticketCount = this.ticketCount + 1;
			}

			if (single) {
				SingleBetStore.receiveTicketStatus(single.ticketId,event)
			}

			if (combo) {
				ComboBetStore.receiveTicketStatus(combo.ticketId,event)
			}
			// 刷新余额
			member.reload(true)
		}

		// nt2 赔率或状态变化
		if (event.nt === 2) {
			event.data?.mks?.forEach((market: any) => {
				market.ops.forEach((opt: any) => {
					// 单式串关
					if (opt.oid === SingleBetStore.singleBet.optionId) {
						// 单式bst为0删除
						if (opt.bst === 0) {
							SingleBetStore.removeSingleBet()
						}
						// 更新到单式串关
						SingleBetStore.singleBet = {
							...SingleBetStore.singleBet,
							betBar: market.betbar,
							odds: opt.odds,
							status: opt.bst,
							oddsStatus: opt.odds - SingleBetStore.singleBet.odds
						}
					}
					// 串关
					const comboIndex = ComboBetStore.comboBet.findIndex(({optionId}) =>
						opt.oid === optionId
					)

					if (comboIndex !== -1) {
						// 串关bst为0时删除
						if (opt.bst === 0) {
							ComboBetStore.removeComboBet(opt.oid)
						} else {
							ComboBetStore.updateComboBet(comboIndex, {
								...ComboBetStore.comboBet[comboIndex],
								odds: opt.odds,
								status: opt.bst,
								betBar: market.betbar,
								oddsStatus: opt.odds - ComboBetStore.comboBet[comboIndex].baseOdds
							})
						}
					}
				})
			})
		}
	}

	get pushData(): Array<{ matchId: string, marketId: string, optionId: string }> {
		// 推送串关数据
		// let _pushData = ComboBetStore.comboBet.map(
		// 	({
		// 		optionId,
		// 		matchInfo: {matchId},
		// 		market: {marketId}
		// 	}) => ({
		// 		matchId,
		// 		marketId,
		// 		optionId
		// 	})
		// )
		let _pushData = ComboBetStore.comboBet.map(
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
		// 推送单式数据
		if (SingleBetStore.singleBet.optionId) {
			const {
				optionId,
				matchInfo: {matchId},
				market: {marketId}
			} = SingleBetStore.singleBet
			_pushData.push({
				optionId,
				matchId,
				marketId
			})
		}
		return _pushData
	}

}
export default new Cart()