import React from 'react';
import { observer } from "mobx-react";
import mergeClass from "../../../../../utils/mergeClass";
import memberStore from "../../../../../stores/member";
import { message } from "antd";

function EuropeOptionButton(
  {
    noBetting,
    checked,
    children,
    onClick
  }: {
    onClick: any
    noBetting: boolean
    checked: boolean
    children?: any
  }
) {

  return (
    <div
      className={mergeClass({
        "europe-option-button": true,
        noBetting,
        checked
      })}
    >
      <button onClick={() => {
        if (!memberStore.isLoged) {
          message.warn('您未登录,请先登录')
          memberStore.accountModal = {visible: true, type: 'login'}
          return;
        }
        if (noBetting) {
          return;
        }
        onClick()
      }}>
        {children}
      </button>
    </div>
  );
}

export default observer(EuropeOptionButton);