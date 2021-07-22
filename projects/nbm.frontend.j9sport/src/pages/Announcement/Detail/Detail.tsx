import React, {useEffect, useState} from "react";
import { useParams, useHistory } from "react-router-dom";
import dayjs from "dayjs";

import {withApi} from "../../../apis";
import Pull from "../../../apis/Pull";

import M from '../../../components/common/m';
import Navs from "../../../components/common/Navs";

interface IDetail {
	body: string
	closeTime: number
	noticeId: string
	startTime: number
	title: string
}

/* eslint-disable react-hooks/exhaustive-deps*/
function Detail(
	{
		api: {pull}
	}: {
		api: {pull: Pull}
	}
) {
	const history = useHistory()
	const {id} = useParams<any>()

	const [detail, setDetail] = useState({} as IDetail)

	useEffect(() => {
		pull.getNoticeDetails(id).then(res => {
			if (res) {
				setDetail(res)
			}else {
				history.push('/announcement')
			}
		})
	}, [])
	return (
		<div className="anno-detail">
			<Navs
				list={[
					{
						textKey: 'pages.annou_list',
						path: '/announcement'
					},
					{ textKey: 'pages.annou_detail' }
				]}
			/>
			<div className="anno-detail-container">
				<div className="title">
					{detail.title}
				</div>
				<div className="content">
					{detail.body}
				</div>
				<div className="time">
					<M id="common.org" />
					<br/>
					{dayjs(detail.closeTime).format("YYYY-MM-DD  HH:mm:ss")}
				</div>
			</div>
		</div>
	)
}

export default withApi({pull: Pull})(Detail);