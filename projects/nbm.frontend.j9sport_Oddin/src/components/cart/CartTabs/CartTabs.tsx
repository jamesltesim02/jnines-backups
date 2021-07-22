import React from "react";
import {observer} from "mobx-react";
import { Badge } from 'antd';
import ComboBet from "../../../stores/cart/ComboBet";
import CartStore from "../../../stores/cart/Cart";

/* eslint-disable react-hooks/exhaustive-deps */
function CartTabs(
	{
		titles,
		tabs
	}: {
		titles: any[]
		tabs: any[]
	}
) {
	const comboBetNum = ComboBet.comboBet.length
	return (
		<div className="cart-tab">
			{/*切换Title*/}
			<div className="tab-control">
				{
					titles
						.map((title, index)=>(
								<div
									key={index}
									className={
										index === CartStore.currentTab
											? "active"
											: ""
									}
									onClick={()=> {
										// 当前tab
										CartStore.currentTab = index
									}}
								>
									{
										index === 1
										&&
										comboBetNum !== 0
										&&
										<Badge count={comboBetNum} />
									}
									{title}
								</div>
						))
				}
			</div>
			{/*切换Tab页*/}
			<div className="tab-content">
				{
					tabs
						.map((tab,index)=> (
							<div
								key={index}
								style={
									CartStore.currentTab !== index
										? {display:"none"}
										: {}
								}
							>
								{tab}
							</div>
						))
				}
			</div>
		</div>
	)
}

export default observer(CartTabs);