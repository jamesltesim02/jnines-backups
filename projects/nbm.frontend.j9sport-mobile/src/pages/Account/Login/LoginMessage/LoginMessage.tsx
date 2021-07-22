import React, { useState } from 'react';

import AccountHeader from "../../components/AccountHeader";
import AccountFooter from "../../components/AccountFooter";
import LoginMessagePhone from "./LoginMessagePhone/LoginMessagePhone";

const tabs = [
  {title: "手机号码"},
  {title: "游戏账号"}
]

function LoginMessage() {
  const [currentTab, setCurrentTabs] = useState(0)

  return (
    <div className="acc-container">
      <AccountHeader
        tabs={tabs}
        onChange={(index: number) => setCurrentTabs(index)}
      />
      <LoginMessagePhone type={currentTab === 0 ? 'phone' : 'username'} />
      <AccountFooter type={"forget-register"} />
    </div>
  );
}

export default LoginMessage;