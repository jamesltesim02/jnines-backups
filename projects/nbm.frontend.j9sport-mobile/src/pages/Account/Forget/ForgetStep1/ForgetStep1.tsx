import React, { useState } from 'react';

import { Link } from "react-router-dom";
import ForgetStep1Google from "./ForgetStep1Google/ForgetStep1Google";
import ForgetStep1Message from "./ForgetStep1Msg/ForgetStep1Message";

/**
 * 步骤一：身份验证
 * @constructor
 */
enum LOGIN_TYPE {
  "google"= 1,
  "message" = 2
}

function ForgetStep1(
  {
    nextStep,
  }: {
    nextStep?: Function
  }
) {

  const [loginType, setLoginType] = useState(LOGIN_TYPE.google)

  return (
    <div className="acc-container">
      {
        loginType === LOGIN_TYPE.google
          ? <ForgetStep1Google nextStep={nextStep}/>
          : <ForgetStep1Message nextStep={nextStep}/>
      }
      <div className="forget-footer">
        <div>
          使用
          <span onClick={() => {
            loginType === LOGIN_TYPE.google
              ? setLoginType(LOGIN_TYPE.message)
              : setLoginType(LOGIN_TYPE.google)
          }}
          >
            {
              loginType === LOGIN_TYPE.google ? '短信验证' : '谷歌验证'
            }
          </span>
        </div>
        <Link to={'/login'}>
          去登录
        </Link>
      </div>
    </div>
  );
}

export default ForgetStep1;