import React from 'react';
import M from "../../common/m";

function TicketStatusTag(
  {
    winLose,
    ticketStatus
  }: {
    winLose: number
    ticketStatus: number
  }
) {

  //系统砍单
  if (ticketStatus === 4) {
    return (
      <span className="winOrLose normal">
				<M id="ticket.chargeback" />
			</span>
    )
  }

  // 未结算返回
  if (ticketStatus !== 3) {
    return null
  }

  // 走盘
  if (winLose === 0) {
    return (
      <span className="winOrLose normal">
				<M id="ticket.draw" />
			</span>
    )
  }

  return (
    <>
      <span className={"winOrLose " + (winLose > 0 ? "win" : "lose")}>
        {winLose > 0 ? <M id="ticket.win" /> : <M id="ticket.lose" />}
			</span>
    </>
  );
}

export default TicketStatusTag;