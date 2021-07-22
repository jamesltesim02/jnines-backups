import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Empty, message } from 'antd';
import copy from 'copy-to-clipboard'
import {MatchState} from '../../../consts/match';
import dayjs from 'dayjs';

import M from '../../../components/common/m'
import TicketOptionName from '../TicketOptionName';
import LoadingBar from '../../../components/common/LoadingBar';
import TicketStatusTag from "./TicketStatusTag";
import { CURRENCY_MAP_TEXT } from "../../../consts/app";

function TicketTable(
	{
		ticketList,
		loading,
		availableTicket
	}: {
		ticketList: any[]
		loading: boolean
		availableTicket: string[]
	}
) {
	const intl = useIntl();
	const history = useHistory()

	if (loading && ticketList.length === 0) {
		return (
			<LoadingBar/>
		)
	}

	if (!loading && ticketList.length === 0) {
		return (
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				description={<M id="ticket.norecords" />}
				style={{marginTop: 200}}
			/>
		)
	}

	return (
		<div className="ticket-table">
			<table>
				<thead>
				<tr>
					<th><M id="ticket.billno" /></th>
					<th><M id="match.sport_type" /></th>
					<th style={{textAlign: 'left'}}><M id="ticket.match_info" /></th>
					<th><M id="ticket.bet_amount" /></th>
					<th><M id="ticket.total_return" /></th>
					<th><M id="ticket.record_profit" /></th>
					<th><M id="ticket.bet_time" /></th>
					<th><M id="ticket.status" /></th>
				</tr>
				</thead>
				<tbody>
				{
					ticketList.map((ticketItem) => {

						const winLose = ticketItem.settleAmount - ticketItem.betAmount
						const result = ticketItem.ticketStatus.toString()
						const color = ticketItem.currency === 1 ? '#d35c7b' : '#4ACA6D'
						const totalOdds = ticketItem.options.reduce((acc: any, cur: any) => (
							acc * cur.odds
						), 1)

						return (
							<tr key={ticketItem.ticketId}>
								<td className="fw7">
									<span onClick={() => {
										if (copy(ticketItem.ticketId)) {
											message.success(
												intl.formatMessage({ id: 'common.copy_success' })
											);
										} else {
											message.warning(
												intl.formatMessage({ id: 'common.copy_fail' })
											);
										}
									}}
									>
										{ticketItem.ticketId}
									</span>
								</td>
								<td className="fw7">
									{
										// 串关 === 1
										ticketItem.betType === 1
											?
											<M id={`sports.${ticketItem.options[0].sportId}`}/>
											:
											<M id={`betType.${ticketItem.betType}`}/>
									}
								</td>
								{/*比赛*/}
								<td style={{textAlign: 'left'}}>
									{
										ticketItem.options.map((option: any) => {
											return (
												<div
													className="league-info"
													key={option.optionId}
												>
													<div>
														{option.tournamentName}
														<span style={{color: "#ef0000"}}>
															{
																option.matchState === MatchState.LIVE
																&&
																` [${option.homeScore}:${option.awayScore}] `
															}
														</span>
													</div>
													<div>{option.matchName}</div>
													<div className="fw7">
														<TicketOptionName {...option} />
													</div>
													{
														availableTicket.includes(option.matchId.toString())
														&&
														<div
															className="goDetail"
															onClick={()=>{
																// 可跳转比赛前往详情
																history.push(`/detail/${option.matchId}`)
															}}
														>
															<M id="match.to_detail" />
														</div>
													}
												</div>
											)
										})
									}
								</td>
								<td className="fw7">
									{ticketItem.betAmount.toFixed(2)}
									@{totalOdds.toFixed(2)}
									<br/>
									<span style={{color}}>{CURRENCY_MAP_TEXT[ticketItem.currency]}</span>
								</td>
								<td className="fw7">
									{
										[3, 4, 5].includes(ticketItem.ticketStatus)
										? ticketItem.settleAmount.toFixed(2)
										: '---'
									}
								</td>
								<td>
										<span className="winOrLose">
											<TicketStatusTag
												ticketStatus={ticketItem.ticketStatus}
												winLose={winLose}
											/>
										</span>
								</td>
								<td className="fw7">
									{dayjs(ticketItem.betTime).format('YYYY-MM-DD HH:mm:ss')}
								</td>
								<td>
									<M id={`ticket.status_${result}`} />
								</td>
							</tr>
						)
					})
				}
				</tbody>
			</table>
		</div>
	)
}

export default TicketTable;