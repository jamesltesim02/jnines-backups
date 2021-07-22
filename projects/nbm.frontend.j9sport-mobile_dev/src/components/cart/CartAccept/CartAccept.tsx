import React, {useEffect, useState} from "react";

import { OddsAccept } from "../../../consts/app";
import appStore from "../../../stores/app";

import M from '../../common/m';

function CartAccept(
	{
		onChange
	}: {
		onChange: Function
	}
) {
	// 获取接受的赔率模式, 投注时以购物车的赔率模式为主
	const [accept, setAccept] = useState(appStore.oddsAccept)

	// 修改接受赔率
	const changeOddsAccept = (val: number) => {
		if (val === accept) {
			val === OddsAccept.BETTER
				? setAccept(OddsAccept.NO)
				: setAccept(OddsAccept.BETTER)
		} else if (
			accept === OddsAccept.ALL
			&&
			val === OddsAccept.BETTER) {
			setAccept(OddsAccept.NO)
		} else {
			setAccept(val)
		}
	}

	useEffect(() => {
		onChange(accept)
	},[accept, onChange])

	return (
		<div className="cart-accept">
			<div className="accept-radio">
				<span
					className={
						(accept === OddsAccept.ALL)
							? "selected"
							: ''
					}
					onClick={() => changeOddsAccept(OddsAccept.ALL)}
				/>
				<M id="bet.accept_all" />
			</div>
			<div className="accept-radio">
            <span
							className={
								(accept === OddsAccept.BETTER || accept === OddsAccept.ALL)
									? "selected"
									: ''
							}
							onClick={() => changeOddsAccept(OddsAccept.BETTER)}
						/>
				
				<M id="bet.accept_better" />
			</div>
		</div>
	)
}
export default CartAccept;
