import React, { useState } from 'react';
import { Tabs } from "antd-mobile";

import NavBar from "../../../components/common/NavBar";
import LoginFast from "./LoginFast";
import LoginMessage from "./LoginMessage";
import LoginGoogle from "./LoginGoogle";

function Login() {

  const tabs = [
    {title: '快速登录'},
    {title: '短信登录'},
    {title: '谷歌登录'}
  ]

  return (
    <div className="Login">
      <NavBar title={'登录'} center/>
      <Tabs
        tabs={tabs}
        initialPage={0}
        swipeable={false}
      >
        {/* 快速登录*/}
        <LoginFast />
        {/* 短信登录*/}
        <LoginMessage />
        {/* 谷歌验证码登录*/}
        <LoginGoogle />
      </Tabs>
    </div>
  );
}

export default Login;