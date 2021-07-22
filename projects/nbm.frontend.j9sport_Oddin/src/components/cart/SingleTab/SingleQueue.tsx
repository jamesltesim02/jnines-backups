import React from "react";
import {observer} from "mobx-react";
import { Statistic } from 'antd';

import SingleBetStore from "../../../stores/cart/SingleBet";
import CartOptionName from "../CartOptionName";
import MarketName from "../../matchs/MarketName";
import AmountInput from "../AmountInput";
import M from "../../common/m";
import mergeClass from "../../../utils/mergeClass";
import {TICKET_REMOVE_TIME, TICKET_STATUS} from "../../../consts/app";

const { Countdown } = Statistic;

function SingleQueue() {

	return (
		<>
			{
				SingleBetStore.waitingQueue.map(singleQueue=> {
					const {
						matchInfo,
						market,
					} = singleQueue.options
					const options = singleQueue.options
					const isCancel = singleQueue.status === TICKET_STATUS.SUCCESS || singleQueue.status === TICKET_STATUS.FAILED

					return (
						<div
							className={
								mergeClass(
									"singleTab-queue",
									singleQueue.status === TICKET_STATUS.SUCCESS ?
									"success"
									: singleQueue.status === TICKET_STATUS.FAILED ?
									"failed": null
								)
							}
							key={singleQueue.ticketId}
						>
							{/*注单相关信息*/}
							<div>
								{/*删除按钮关闭*/}
								{
									(singleQueue.status ||singleQueue.status === TICKET_STATUS.FAILED)
									?
									<span
										className="remove-bet"
										onClick={()=>{
											if (isCancel){
												SingleBetStore.removeQueue(singleQueue.ticketId)
											}
										}}
									>
										{
											isCancel
											&&
											<>
												<Countdown
													format={'s'}
													value={singleQueue.removeTime + (TICKET_REMOVE_TIME + 1000)}
												/>
												S<M id="common.close" />
											</>
										}
									</span> : null
								}
								{/*玩法@赔率*/}
								<div>
									<CartOptionName
										option={options}
										match={matchInfo}
										market={market}
									/>
									@
									{options.odds}
								</div>
								{/*球队vs球队*/}
								<div>
									{matchInfo.matchName}
								</div>
								{/*玩法*/}
								<div>
									<MarketName
										{...market}
										sportId={matchInfo.sportId}
									/>
								</div>
								{/*球类/联赛名*/}
								<div><M id={`sports.${matchInfo.sportId}`}></M> / {matchInfo.tournamentName}</div>
							</div>
							{/*投注金额区*/}
							<div className="bet-area">
								{/*金额*/}
								<AmountInput
									betAmount={singleQueue.betAmount}
									status={singleQueue.status}
									msg={singleQueue.errMsg}
									wait={true}
								/>
								{/*投注按钮*/}
								<button
									disabled={true}
									className="betBtn"
								>
									<M id="bet.submit_bet" />
								</button>
							</div>

							{/*是否加入串关*/}
							<div className="add-combo">
								<div>
								</div>
								{/*预计返回的金额*/}
								<div>
									<M id="bet.will_return" />
									<span className="return-amount">
										{singleQueue.returnAmount}
									</span>
								</div>
							</div>
						</div>
					)
				})
			}
		</>
	)
}
export default observer(SingleQueue);