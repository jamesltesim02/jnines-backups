import React from 'react';
import { observer } from "mobx-react";
import { Toast } from "antd-mobile";

import mergeClass from "../../../../../utils/mergeClass";
import memberStore from "../../../../../stores/member";
import { useHistory } from "react-router";

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
  const history = useHistory()
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
          Toast.info('您未登录,请先登录')
          history.push('/login')
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