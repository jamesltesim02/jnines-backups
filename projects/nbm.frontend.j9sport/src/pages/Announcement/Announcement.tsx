import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import { Pagination } from 'antd';
import {useHistory} from "react-router-dom";

import Pull from "../../apis/Pull";
import {withApi} from "../../apis";

import M from '../../components/common/m';
import Navs from "../../components/common/Navs";

function Announcement(
	{
		api: {pull}
	}: {
		api: { pull: Pull }
	}
) {
	const history = useHistory()
	const [annoList, setAnnoList] = useState([])

	const [pageIndex, setPageIndex] = useState(1)

	const [total,setTotal] = useState(0)

	function showTotal(){
		return (
			<M
				id="common.records"
				values={{ total }}
			/>
		);
	}
	function onPageChange(page: number) {
		setPageIndex(page)
	}

	useEffect(() => {
		pull.getNoticeList(pageIndex).then(({count, notices}) => {
			setAnnoList(notices)
			setTotal(count)
		})
	}, [pull, pageIndex])

	return (
		<div className="Announcement-wrapper">
			<Navs list={[{ textKey: 'pages.annou_list' }]} />
			<div className="Announcement">
				<M id="pages.annou_list" />
				<div className="title">
					<span><M id="pages.annou_title" /></span>
					<span><M id="pages.annou_time" /></span>
				</div>
				<ul className="detail-list">
					{
						annoList.map((annoItem: any) => (
							<li
								key={annoItem.noticeId}
								onClick={() => {
									history.push(`anno-detail/${annoItem.noticeId}`)
								}}
							>
								<span>{annoItem.title}</span>
								<span>{dayjs(annoItem.startTime).format("YYYY-MM-DD  HH:mm:ss")}</span>
							</li>
						))
					}
				</ul>
				<div className="pagination">
					<Pagination
						size="small"
						total={total}
						current={pageIndex}
						showTotal={showTotal}
						showQuickJumper
						onChange={onPageChange}
						hideOnSinglePage
					/>
				</div>
			</div>
		</div>
	)
}

export default withApi({pull: Pull})(Announcement);