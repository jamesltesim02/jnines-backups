import M from '../../../components/common/m';
import React, {useState} from "react";
import {Card, Skeleton} from "antd";
import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration";
import {getResourceUrl} from "../../../components/common/Image";
import {ResourceDir} from "../../../consts/network";
import {useHistory} from "react-router-dom";

dayjs.extend(Duration)

function PromotionCard(
	{
		cardData
	}: {
		cardData?: any
	}
) {
	const history = useHistory()
	const [imgLoad, setImgLoad] = useState(true)

	if (!cardData) {
		return (
			<Card
				hoverable
				className="promotion-card"
				bordered={false}
			>
				<Skeleton.Image/>
				<Skeleton active round/>
			</Card>
		)
	}


	const handleClick = (item: any) => {
		if (item.matchId && item.matchId !== 'null') {
			history.push(`/detail/${item.matchId}`);
			return;
		}
		if (/^https?:\/\//i.test(item.url)) {
			window.open(item.url);
			return;
		}
		if (item.url) {
			history.push(item.url);
			return;
		}

		history.push(`/promo-detail/${item.slideId}`);
	};

	const duration = dayjs.duration(dayjs(cardData.closeTime).diff(dayjs()))

	return (
		<Card
			hoverable
			className="promotion-card"
			bordered={false}
			onClick={() => {
				handleClick(cardData)
			}}
		>
			{
				imgLoad ?
					<img
						src={getResourceUrl(cardData.imageAd, ResourceDir.SLIDE)}
						alt={cardData.slideId}
						onError={()=>{
							setImgLoad(false)
						}}
					/>: <Skeleton.Image/>
			}
			<div className="promotion-card-content">
				<div className="title">
					<span>
						{cardData.title.zh}
					</span>
					<span className="activity-time">
						{
							duration.asMonths() >= 1
							? (<M id="pages.promo_forever" />)
							: (
								<M
									id="pages.promo_countdown"
									values={{
										days: duration.days(),
										hours: duration.hours(),
										minutes: duration.minutes(),
										seconds: duration.seconds(),
									}}
								/>
							)
						}
					</span>
				</div>
				<div className="text">
					{cardData.summary.zh}
				</div>
			</div>
		</Card>
	)

}

export default PromotionCard;