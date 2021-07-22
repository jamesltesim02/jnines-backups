import React from 'react';
import { observer } from "mobx-react";
import CartItemTotal from "../CartItemTotal";
import CartStore from "../../../stores/cart/Cart";
import EmptyList from "../../common/EmptyList";
import M from '../../common/m'

function Unsettle(
  {
    unsettleList = [],
    availableTicket = []
  }
) {

  return (
    <div className="unsettle">
      {
        unsettleList.map((ticket: any) => {
            return (
              <CartItemTotal
                key={ticket.ticketId}
                ticketInfo={ticket}
                availableTicket={availableTicket}
              />
            )
          }
        )
      }
      {
        unsettleList.length === 0 ? <EmptyList/> : null
      }
      <button onClick={() => CartStore.toggleSidebar()}>
        <M id="common.close" />
      </button>
    </div>
  );
}

export default observer(Unsettle);