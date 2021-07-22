import React, {useEffect, useState} from "react";
import {Col, Row} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons'

import Pull from "../../apis/Pull";
import {withApi} from "../../apis";

import M from '../../components/common/m';
import PromotionCard from "./PromotionCard";

function Promotion(
	{
		api: {pull}
	}: {
		api: { pull: Pull }
	}
) {

	const [promotionList, setPromotionList] = useState([])

	useEffect(() => {
		pull.getActivity().then(res => {
			setPromotionList(res)
		})
	}, [pull])

	return (
		<div className="promotion-wrapper">
			<div className="header">
				<div><M id="pages.promo_title" /></div>
				<div>
					<span>PROMOTIONS</span>
					<span>
						<InfoCircleOutlined style={{transform: 'translate(-5px, 2px)'}}/>
						<M id="pages.promo_tip" />
					</span>
				</div>
			</div>
			<div>
				<div className="card-wrapper">
					<Row gutter={16}>
						{
							promotionList.length === 0
							&&
							['1','2','3'].map(item => (
                <Col
									span={8}
									key={item}
								>
                  <PromotionCard />
                </Col>
              ))
						}
						{
							promotionList.map((item: any) => {
								return (
									<Col
										span={8}
										key={item.slideId}
									>
										<PromotionCard
											cardData={item}
										/>
									</Col>
								)
							})
						}
					</Row>
				</div>
				,
			</div>
		</div>
	)
}

export default withApi({pull: Pull})(Promotion);