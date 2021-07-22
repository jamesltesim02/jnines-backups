import React from "react";
import {observer} from "mobx-react";

import Quote from "../../apis/Quote";
import {withApi} from "../../apis";

import OptionStore from "../../stores/matchs/Option"
import MarketStore from "../../stores/matchs/Market"
import MatchStore from "../../stores/matchs/Match"
import SingleBetStore from "../../stores/cart/SingleBet";
import ComboBetStore from "../../stores/cart/ComboBet";
import CartStore, {TAB_INDEX} from "../../stores/cart/Cart";
import {message} from "antd";
import {useIntl} from "react-intl";
import memberStore from "../../stores/member";
import {toSignin} from "../../utils/MainSiteUtils";

function BetContainer(
	{
		option,
		market,
		matchInfo,
		children,
		combo = false,
		api: {quote}
	}: {
		option: OptionStore,
		market: MarketStore,
		matchInfo: MatchStore,
		children: Function,
		combo?: boolean,
		api: { quote: Quote }
	}
) {
	const intl = useIntl();
	const [quoting, setQuoting] = React.useState(false)

	const comboCheck = (ComboBetStore.comboBet.findIndex(val=> val.optionId === option.optionId) !== -1)

	const checked = SingleBetStore.singleBet.optionId === option.optionId

	// 串关点水
	const comboQuote = ()=>{
		if (!comboCheck) {
			quote.comboQuote(
				// params
				ComboBetStore.comboBet.map(v =>({optionId: v.optionId}))
			).then(({options, extras}) =>{
				// 将点水结果加入store
				ComboBetStore.quoteComboBet(options,extras)
				// 点水回来判断errorCode,为0更新到market和match
				if (options.errorCode === 0) {
					options.forEach((optionsItem: any) => {
						// 当前为串关,赔率放入comboOdds
						market.updateByQuote({
							...optionsItem,
							comboOdds: optionsItem.odds,
							odds: null
						})
						// 将比分和marketGroup传给match
						matchInfo.setScoreByQuote(optionsItem.matchScore,market.marketGroup)
					})
				}
				// 将比分和marketGroup传给match
			}).finally(()=>{
				// 结束加载
				setQuoting(false)
			})
		}
	}
 // 单式点水
	const singleQuote = ()=> {
		quote.doQuote([{optionId: option.optionId}])
			.then(([options]) => {

				if (options.status !== 1) {
					message.warning(
						intl.formatMessage({ id: 'bet.unavailable' })
					);
					return;
				}
				// 点水数据加入store

				SingleBetStore.singleBet = {
					market,
					matchInfo,
					...option,
					...options,
				}
				// 当前为单关,放入odds
				market.updateByQuote({
					...options,
					odds: options.odds
				})
				// 将比分和marketGroup传给match
				matchInfo.setScoreByQuote(options.matchScore,market.marketGroup)
			}).finally(() =>{
			// 结束加载
			setQuoting(false)
		})
	}

	return (
		<>
			{
				children && children({
					checked,
					comboCheck,
					quoting,
					onToggle() {
						if (!memberStore.isLoged) {
							message.warn(
								intl.formatMessage({ id: 'common.sign_first' })
							);
							setTimeout(toSignin, 1500);
							return;
						}

						if (memberStore.balance < 1) {
							message.warn(
								intl.formatMessage({ id: 'bet.over_amount' })
							);
							return;
						}

						//点击串关单式切换购物车tab页
						if (combo) {
							CartStore.currentTab = TAB_INDEX.COMBO
						}else {
							CartStore.currentTab = TAB_INDEX.SINGLE
						}

						// 如果当前状态为不可投,则不做任何操作
						if (option.status !== 1) {
							message.warning(
								intl.formatMessage({ id: 'bet.unavailable' })
							);
							return;
						}
						CartStore.ticketTab = 'cart'

						// 单式注单
						if (!combo) {
							// 没被选中
							if (!checked) {
								setQuoting(true)
								singleQuote()
							}else {
								// 被选中删除掉已有注单
								SingleBetStore.removeSingleBet()
							}
						}

						// 串关
						if (combo) {
							if (!comboCheck) {
								// 加入串关点水
								ComboBetStore.addToComboBet({
									market,
									matchInfo,
									...option
								})
								// 点水
								if (ComboBetStore.comboBet.length > 1){
									// 开启加载
									setQuoting(true)
									comboQuote()
								}
							} else {
								// 被选中删除掉已有注单
								ComboBetStore.removeComboBet(option.optionId)
								// 购物车存在串关再次点水
								if (ComboBetStore.comboBet.length > 0) {
									comboQuote()
								}
							}
						}
					}
				})
			}
		</>
	)
}

export default withApi({quote: Quote})(observer(BetContainer));