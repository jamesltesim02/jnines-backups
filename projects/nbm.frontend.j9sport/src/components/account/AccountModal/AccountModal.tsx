import React from 'react';
import { createPortal } from "react-dom";
import { observer } from "mobx-react";
import { CloseOutlined } from "@ant-design/icons";
import memberStore from "../../../stores/member";

import Login from "../Login";
import Forget from "../Forget";
import Register from "../Register";

function AccountModal({}) {

  if (!memberStore.accountModal.visible) {
    return null;
  }

  const Content: any = () => {
    switch (memberStore.accountModal.type) {
      case "login":
        return <Login />;
      case "forget":
        return <Forget />;
      case "register":
        return <Register />;
    }
  }

  return createPortal(
    <div className="account">
      <div className="account-mask"></div>
      <div className="account-wrap">
        <div className="account-content">
          <div
            className="account-content-close"
            onClick={() => memberStore.accountModal = {visible: false}}
          >
            <CloseOutlined/>
          </div>
          <Content />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default observer(AccountModal);