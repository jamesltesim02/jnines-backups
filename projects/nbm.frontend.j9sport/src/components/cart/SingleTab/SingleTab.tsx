import React, {useState} from "react";
import {observer} from "mobx-react";
import QueueAnim from 'rc-queue-anim';

import appStore from "../../../stores/app";
import SingleBetStore from "../../../stores/cart/SingleBet";

import CartEmpty from "../CartEmpty";
import CartAccept from "../CartAccept";
import SingleTabItem from "./SingleTabItem";
import SingleQueue from "./SingleQueue";

function SingleTab() {

	// 接受的赔率模式
	const [accept, setAccept] = useState(appStore.oddsAccept)

	return (
		<div className="singleTab">
			{
				SingleBetStore.singleBet.optionId
					?
					<>
						<QueueAnim>
							{
								SingleBetStore.singleBet.optionId
								&&
								<SingleTabItem accept={accept}/>
							}
						</QueueAnim>
						<CartAccept onChange={(val: number)=> {
							setAccept(val)
						}}
						/>
						{/* TODO */}
						<div className="bet-tips">*实际盘口和赔率以最终受注结果为准</div>
					</>
					:
					<CartEmpty/>
			}
			{
				SingleBetStore.waitingQueue.length > 0
				&&
				<div className="singleQueue">
					<SingleQueue/>
				</div>
			}
		</div>
	)
}

export default observer(SingleTab);