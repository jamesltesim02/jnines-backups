import React from "react";
import dayjs from "dayjs";

import CartEmpty from "../CartEmpty";
import LoadingBar from "../../common/LoadingBar";
import TicketOptionName from "../../../pages/Ticket/TicketOptionName";
import IconSport from "../../icons/icon-type/icon-sports";
import {MatchState} from "../../../consts/match";

import M from '../../common/m';

function Ticket(
  {
    ticketList,
    loading
  }: {
    ticketList: any,
    loading: boolean
  }
) {

  if (loading) {
    return (
      <div style={{height: "250px"}}>
        <LoadingBar/>
      </div>
    )
  }
  if (loading && ticketList.length === 0) {
    return <CartEmpty/>
  }

  return (
    <>
      {
        ticketList.length > 0
          ?
          <div>
            {
              ticketList.map((ticketItem: any) => {
                //总投注额
                const totalOdds = ticketItem.options.reduce(
                  (acc: any, cur: any) => (acc * cur.odds),
                  1
                );

                return (
                  // 购物车-我的注单
                  <div
                    className="cart-ticket"
                    key={ticketItem.ticketId}
                  >
                    <div className="cart-ticket-header">
                      {/*下单时间*/}
                      <div>
                        <M id="ticket.bet_time"/>:
                        {dayjs(ticketItem.betTime).format("YYYY/MM/DD HH:mm")}
                      </div>
                      {/*订单号码*/}
                      <div>
                        <M id="ticket.billno"/>:
                        {ticketItem.ticketId}
                      </div>
                    </div>
                    {
                      ticketItem.options.map((option: any) => (
                        <div
                          className="cart-ticket-content"
                          key={option.optionId}
                        >
                          <div className="content-item">
                            {/*球队名*/}
                            <div>
                              {option.matchName}
                              <span style={{color: "#ef0000"}}>
															{
                                option.matchState === MatchState.LIVE
                                &&
                                ` [${option.homeScore}:${option.awayScore}] `
                              }
														</span>
                            </div>
                            {/*联赛名*/}
                            <div>
                              {option.tournamentName}
                            </div>
                            {/*玩法赔率*/}
                            <div>
                              <TicketOptionName {...option} />
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    <div className="cart-ticket-footer">
                      {/*投注额*/}
                      <div>
                        <IconSport type={ticketItem.sportId}/>
                        <M id="bet.bet_label"/>
                        <M
                          id="bet.amount"
                          values={{amount: ticketItem.betAmount.toFixed(2)}}
                        />
                      </div>
                      {/*预计返还*/}
                      <div>
                        <M id="bet.will_return"/>
                        <span className="return">
												<M
                          id="bet.amount"
                          values={{amount: (totalOdds * ticketItem.betAmount).toFixed(2)}}
                        />
											</span>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div> :
          <CartEmpty/>
      }
    </>
  )
}

export default Ticket;