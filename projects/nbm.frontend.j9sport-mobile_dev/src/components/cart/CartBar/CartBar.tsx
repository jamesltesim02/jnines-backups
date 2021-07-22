import React, { useEffect, useState } from 'react';
import drawerImg from "../images/drawer.png";
import { observer } from "mobx-react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom"
import ComboBetStore from "../../../stores/cart/ComboBet";
import CartStore from "../../../stores/cart/Cart";

import M from '../../common/m'

function CartBar() {

  const [position, setPosition] = useState(false)

  const location = useLocation()

  useEffect(() => {
    const hasTabBar = !!document.getElementsByClassName('tab-bar')[0]
    setPosition(hasTabBar)
  }, [location.pathname])

  const FooterCork = () => {
    return createPortal(
      <div className="footer-cork"></div>,
      document.getElementById("root") as HTMLElement
    )
  }

  return (
    <>
      <div
        className="cart-bar"
        style={!position ? {bottom: '0px'} : {}}
        onClick={() => CartStore.toggleSidebar()}
      >
        <div className="cart-bar-ticket">
          <span>
            <M id="bet.tab1_cart" />
          </span>
          <i className="ticket-num">
            {
              ComboBetStore.current.status === undefined
              &&
              ComboBetStore.current.options.length
            }
          </i>
          <span>
            <M id="bet.tab1_ticket" />
          </span>
        </div>
        <div
          className="cart-bar-drawer"
          onClick={() => {
          }}
        >
          <img src={drawerImg} alt=""/>
        </div>
      </div>
      <FooterCork/>
    </>
  );
}

export default observer(CartBar);