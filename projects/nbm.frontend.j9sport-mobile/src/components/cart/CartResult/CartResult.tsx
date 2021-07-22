import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import memberStore from "../../../stores/member";
import ComboBet from "../../../stores/cart/ComboBet";
import Cart from "../../../stores/cart/Cart";

import CartItemTotal from "../CartItemTotal";
import LoadingImg from '../images/loading.png';
import SuccessImg from "../images/success.png";
import FailImg from "../images/fail.png";
import mergeClass from "../../../utils/mergeClass";
import M from '../../common/m'

function CartResult(
  {
    combo = false,
    ticketInfo
  }: {
    combo?: boolean
    ticketInfo?: any
  }
) {

  const history = useHistory()

  useEffect(() => {
    if (ticketInfo.status !== undefined) {
      memberStore.reload()
    }
  },[ticketInfo.status])

  if (!ticketInfo.betTime) {
    return null;
  }

  const doBetAgain = () => {
    ComboBet.resetTicketStatus(ComboBet.current?.ticketId)
  }

  return (
    <div
      className={
        mergeClass({
          combo,
          "cart-result": true
        })
      }
      style={ticketInfo.status !== undefined ? {
        backgroundColor: "#1e1e1e",
        position: 'relative'
      } : {}}
    >
      {/*加载*/}
      {
        ticketInfo.status !== undefined ?
          <div className="cart-result-winlose">
            <div>
              <img src={ticketInfo.status ? SuccessImg : FailImg} alt=""/>
              <span>
                {
                  ticketInfo.status
                    ? ticketInfo.errMsg
                    : (
                      <>
                        {ticketInfo.errMsg}
                        {
                          combo
                          &&
                          <>
                            ,<b onClick={doBetAgain}><M id="ticket.bet_Again" /></b>
                          </>
                        }
                      </>
                    )
                }
              </span>
            </div>
            <CartItemTotal ticketInfo={ticketInfo}/>
            <button
              onClick={() => {
                Cart.toggleSidebar()
                ticketInfo.status
                &&
                history.push('/ticket')
              }}
            >
              {
                ticketInfo.status ? <M id="ticket.more_ticket"/> : <M id="common.close"/>
              }
            </button>
          </div>
          :
          <div className="cart-result-loading">
            <img src={LoadingImg} alt=""/>
          </div>
      }
    </div>
  );
}

export default observer(CartResult);