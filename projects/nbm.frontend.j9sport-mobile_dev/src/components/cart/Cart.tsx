import React from 'react';
import { observer } from "mobx-react";
import ComboBetStore from "../../stores/cart/ComboBet";
import CartBar from "./CartBar";
import CartSidebar from "./CartSidebar";

function Cart() {
  return (
    <div className="cart">
      {
        ComboBetStore.comboQueue.length > 0 ?
          <CartBar/> : null
      }
      <CartSidebar/>
    </div>
  );
}

export default observer(Cart);