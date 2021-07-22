import React, {useEffect, useState} from "react";
import { useIntl } from "react-intl";
import { observer } from 'mobx-react';
import {Collapse, message} from "antd";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'

import mergeClass from "../../../utils/mergeClass";
import Pull from "../../../apis/Pull";
import { withApi } from "../../../apis";
import memberStore from "../../../stores/member";

import M from '../../../components/common/m';
import { toSignin } from "../../../utils/MainSiteUtils";

const {Panel} = Collapse;
dayjs.extend(customParseFormat)

// 初始化上个月的时间
let moth: any[] = []

for (let i = 0; i < 30; i ++) {
	moth.push({
		time: dayjs().subtract(i,'day').format('MM/DD'),
		data: {}
	})
}

/* eslint-disable react-hooks/exhaustive-deps */
function TicketTotal(
	{
		api: { pull },
		getTotalRes
	}: {
		api: { pull: Pull }
		getTotalRes: Function
	}
) {
	const intl = useIntl();

	const { isLoged } = memberStore;
	const [dayList, setDayList] = useState(moth)
	const [current, setCurrent] = useState('')

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {

		if (!isLoged) {
			message.warn(intl.formatMessage({ id: 'common.sign_first' }));
			setTimeout(toSignin, 1500);
			return;
		}
		pull.getUserBetStatistics({
			dayCount: 100
		}).then(res => {

			setDayList(
				dayList.map(({time,data}) => {
					const match = res.find((value: any) => dayjs(value.betDay).format('MM/DD') === time)

					if (match) {
						return {
							time: dayjs(match.betDay).format('MM/DD'),
							data: match
						}
					}else {
						return {
							time,
							data
						}
					}
				}))
		})
	},[isLoged])

	const weekGroup  = [
		dayList.slice(0,7),
		dayList.slice(7,14),
		dayList.slice(14,21),
		dayList.slice(21,29),
	]

	return (
		<div className="ticket-total">
			<Collapse
				defaultActiveKey={weekGroup[0][0].time}
				expandIconPosition={"right"}
			>
				{
					weekGroup.map((week, index) => {

						const weekWinLose = week.reduce((acc,cur) =>{
							if (cur.data.totalBetAmount) {
								return acc + (cur.data.totalSettleAmount + cur.data.unSettleAmount - cur.data.totalBetAmount)
							}else {
								return acc
							}
						},0)

						return (
							<Panel
								className="panel"
								header={`${week[0].time}~${week[week.length-1].time}`}
								key={week[0].time}
								extra={
									<span className={
										mergeClass(
											'fw7',
											weekWinLose > 0?
												'win':"lose"
										)
									}>{weekWinLose.toFixed(2) || ''}</span>
								}
							>
								<div className="panel-head">
									<span><M id="ticket.date" /></span>
									<span><M id="ticket.amount" /></span>
									<span><M id="ticket.profit" /></span>
								</div>
								{
									week.map(day=> {

										const { time, data } = day
										const winLose = (
											data.totalBetAmount
											&&
											data.totalSettleAmount + data.unSettleAmount - data.totalBetAmount
										);

										return (
											<div
												className={
													mergeClass({
														'panel-item': true,
														'current':time === current
													})
												}
												key={time}
												onClick={() => {
													setCurrent(time)
													// 查询对应时间
													if (data.totalBetAmount) {
														const startTime = dayjs(`${dayjs().year()}/${time}`,'YYYY/MM/DD').valueOf()
														const limitTime = dayjs(startTime).add(1,'d').valueOf()
														getTotalRes({startTime, limitTime})
													}
												}}
											>
											<span>
												{time}
											</span>
												<span className="fw7">
												{
													(
														data.totalBetAmount
														&&
														data.totalBetAmount.toFixed(2)
													) || '--'
												}
											</span>
												<span className={
													mergeClass(
														'fw7',
														winLose > 0
														?
														'win'
														:(winLose && 'lose')
													)
												}>
												{
													(
														winLose
														&&
														winLose.toFixed(2)
													) || '--'
												}
											</span>
											</div>
										)
									})
								}
							</Panel>
						)
					})
				}
			</Collapse>
		</div>
	)
}

export default withApi({pull: Pull})(observer(TicketTotal));