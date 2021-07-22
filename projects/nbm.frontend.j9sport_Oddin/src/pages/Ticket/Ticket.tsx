import React, {useEffect, useState} from "react";
import { observer } from 'mobx-react';
import {DatePicker, Menu, Dropdown, Pagination, message} from 'antd';
import { CaretDownOutlined } from "@ant-design/icons"
import dayjs from "dayjs";

import {withApi} from "../../apis";
import Pull from "../../apis/Pull";
import {AVAILABLE_SPORTS} from "../../consts/match";
import memberStore from "../../stores/member";

import TicketTotal from "./TicketTotal";
import TicketTable from "./TicketTable";
import M from "../../components/common/m";
import { useIntl } from "react-intl";
import { toSignin } from "../../utils/MainSiteUtils";

const { RangePicker } = DatePicker;

const settle = {
	'全部注单': -1,
	'已结算': 1,
	'未结算': 0
}

const initialState = {
	queryParams: {
		ticketState: -1,
		pageIndex: 1,
		pageSize: 10
	},
	filterParams: {
		sportId: 0,
		startTime: dayjs().subtract(30,"day").valueOf(),
		limitTime: dayjs().valueOf()
	}
}

function disabledDate(current: any) {
	return current < dayjs().subtract(30, "day") || current > dayjs().add(0, 'day')
}

function Ticket(
	{
		api: {pull}
	}: {
		api: { pull: Pull }
	}
) {
	const intl = useIntl();
	const { isLoged } = memberStore;

	// 查询参数
	const [queryParams, setQueryParams] = useState({...initialState.queryParams})
	// 筛选,时间
	const [filterParams, setFilterParams] =useState({...initialState.filterParams})

	const [loading, setLoading] = useState(false)

	const [ticketList, setTicketList] =useState([])

	const [totalCount, setTotalCount] = useState(0)

	const [availableTicket, setAvailableTicket] = useState([])

	const [rangePicker, setRangePicker] = useState('')
	// 下拉选项点击处理
	function handleDropClick({key}: any) {
		setFilterParams({
			...filterParams,
			sportId: Number(key)
		})
	}

	// 分页页数变化
	function onPageChange(page: number) {
		setQueryParams(
			{
				...queryParams,
				pageIndex: page
			}
		)
	}
	// 分页条数变化
	function onSizeChange(current: number, size: number) {
		setQueryParams({
			...queryParams,
			pageIndex: current,
			pageSize: size
		})
	}
	// 点击统计栏时间
	function getTotalRes(time: any) {

		setFilterParams({...initialState.filterParams})
		setRangePicker(dayjs().valueOf.toString())
		setQueryParams({
			...initialState.queryParams,
			...time
		})
	}

	// 下拉菜单
	const sportsDrop = (
		<Menu onClick={handleDropClick}>
			<Menu.Item key={0}>
				<M id="common.all" />
			</Menu.Item>
			{
				AVAILABLE_SPORTS.map(value => (
					<Menu.Item key={value}>
						<M id={`sports.${value}`}/>
					</Menu.Item>
				))
			}
			<Menu.Item key={1}>
				<M id="betType.2" />
			</Menu.Item>
		</Menu>
	)

	/* eslint-disable react-hooks/exhaustive-deps */
	// 我的注单查询
	useEffect(() => {
		setLoading(true)
		if (!isLoged) {
			message.warn(intl.formatMessage({ id: 'common.sign_first' }));
			setTimeout(toSignin, 1500);
			return;
		}
		// 查询注单
		pull.getTickets(queryParams).then(({tickets,ticketCount }) => {
			setTicketList(tickets)
			if (ticketCount) {
				setTotalCount(ticketCount)
			}
		}).finally(()=>{
			setLoading(false)
		})
		// 查询可跳转详情的注单列表
		pull.getBetMatchByUser().then(res => {
			setAvailableTicket(res)
		})

	}, [queryParams,isLoged])

	useEffect(() => {
		// 增加右上角小红点
		const ticketEl = document.getElementById('options-ticket-link')
		if (ticketEl) {
			ticketEl.classList.remove('top-right-dot')
		}
	},[])

	return (
		<div className="ticket-wrapper">
			{/*左侧统计栏*/}
			<TicketTotal getTotalRes={getTotalRes}/>
			{/*注单查询列表*/}
			<div className="ticket-content">
				{/*筛选条件*/}
				<div className="ticket-content-header">
					{/*全部/已结算/未结算*/}
					<div className="settle">
						{
							Object.entries(settle).map(([key, value]) => (
								<span
									key={key}
									className={queryParams.ticketState === value ? "selected": ''}
									onClick={()=>{
										setQueryParams({
											...queryParams,
											ticketState: value,
											pageIndex: 1})}
									}
								>
									{key}
								</span>
							))
						}
					</div>
					<div className="query">
						{/*体育类型下拉*/}
						<div className="query-type">
							<M id="match.sport_type" />
							<Dropdown trigger={['click']} overlay={sportsDrop}>
								<button>
									{
										filterParams.sportId !== 0
										? (<M id={`sports.${filterParams.sportId}`}/>)
										: (<M id="common.all" />)
									}
									<CaretDownOutlined/>
								</button>
							</Dropdown>
						</div>
						{/*查询时间*/}
						<div className="query-time">
								<RangePicker
									key={rangePicker}
									disabledDate={disabledDate}
									onChange={(date,dateStrings)=>{
										setFilterParams({
											...filterParams,
											startTime: dayjs(dateStrings[0]).valueOf(),
											limitTime: dayjs(dateStrings[1]).valueOf()
										})
									}}
								/>
						</div>
						<button
							className="search"
							onClick={()=> {
								setQueryParams({
									...queryParams,
									...filterParams
								})
							}}
						>
							<M id="common.search" />
						</button>
					</div>
				</div>
				{/*注单列表*/}
					<TicketTable
						availableTicket={availableTicket}
						loading={loading}
						ticketList={ticketList}
					/>
				{/*分页器*/}
				{
					ticketList.length > 0
					&&
					<Pagination
						className="pagination"
						size="small"
						showQuickJumper
						current={queryParams.pageIndex}
						pageSize={queryParams.pageSize}
						total={totalCount}
						onChange={onPageChange}
						onShowSizeChange={onSizeChange}
						showSizeChanger={false}
						showTotal={()=> <M id="common.records" values={{ total: totalCount }} />}
					/>
				}

			</div>
		</div>
	)
}

export default withApi({pull: Pull})(observer(Ticket));