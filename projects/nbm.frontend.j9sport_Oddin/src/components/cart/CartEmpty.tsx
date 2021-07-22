import React from "react";
import EmptyImg from "../icons/icon-normal/empty-box.png";

import M from '../common/m';

function CartEmpty() {
	return (
		<div className="empty">
			<img src={EmptyImg} alt=""/>
			<span><M id="ticket.norecords" /></span>
		</div>
	)
}

export default CartEmpty;