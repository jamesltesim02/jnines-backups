import React from "react";
import { useIntl } from "react-intl";
import {observer} from "mobx-react";

import {CloseOutlined} from "@ant-design/icons";
import Match from "../../../stores/matchs/Match";
import Market from "../../../stores/matchs/Market";
import CartOptionName from "../CartOptionName";
import MarketName from "../../matchs/MarketName";
import ComboBetStore from "../../../stores/cart/ComboBet";
import mergeClass from "../../../utils/mergeClass";
import M from "../../common/m";

function ComboTabItem(
	{
		wait = false,
		matchInfo,
		market,
		option,
	}: {
		wait?: boolean,
		matchInfo: Match,
		market: Market,
		option: any,
	}
) {
	const intl = useIntl();

	const quoteMsg = ()=>{
		if (
			option.errCode === 512
			||
			ComboBetStore.comboBet.length < market.combo
		) {
			if (market.combo === 2) {
				return intl.formatMessage({id: 'bet.double_required'})
			}
			if (market.combo === 3) {
				return intl.formatMessage({id: 'bet.treble_required'})
			}
			return intl.formatMessage(
				{ id: 'bet.combo_required' },
				{ count: market.combo }
			);
		}
		if (option.status === -1) {
			return '盘口已关闭'
		}
		if (option.errCode !== 0) {
			return option.errMsg
		}
	}
	return (
		<div className="comboTab-item">
			{/*删除串关*/}
			<CloseOutlined
				className="remove"
				onClick={()=>{
					ComboBetStore.removeComboBet(option.optionId)
				}}
			/>
			<div className="item-info">
				<div>
					{/*玩法@赔率*/}
					<CartOptionName
						option={option}
						match={matchInfo}
						market={market}
					/>
					@
					<div className={mergeClass(
						"bet-odds-change",
						ComboBetStore.oddsStatus(option.optionId)
					)}
					>
						<span>
							{option.odds.toFixed(2)}
						</span>
					</div>
				</div>
				<div>
					{/*玩法*/}
					<MarketName
						{...market}
						sportId={matchInfo.sportId}
					/>
				</div>
				<div>
					{/*球队vs球队 滚球比分*/}
					{matchInfo.matchName}
					<span style={{color: "#FF4A4A"}}>
						{
							matchInfo.score
							&&
							` [${matchInfo.score.join(':')}]`
						}
					</span>
					{
						!wait
							&&
						<span className="change">
						</span>
					}
				</div>
				<div>
					{/*球类/联赛名*/}
					<div><M id={`sports.${matchInfo.sportId}`}></M> / {matchInfo.tournamentName}</div>
				</div>
				<div style={{color: 'red'}}>
					{
						!wait
						&&
						quoteMsg()
					}
				</div>
			</div>
		</div>
	)
}

export default observer(ComboTabItem);