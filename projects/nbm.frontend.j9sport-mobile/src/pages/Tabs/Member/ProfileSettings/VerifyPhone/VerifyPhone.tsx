import React from 'react';
import { useApi } from "../../../../../apis";
import { Toast } from "antd-mobile";
import { useHistory } from "react-router";
import User from "../../../../../apis/User";

import BoundPhone from "../components/BoundPhone";
import NavBar from "../../../../../components/common/NavBar";


function VerifyPhone () {
  const [user] = useApi([User])
  const history = useHistory()
  const handleVerify =async (params: any) => {
    try {
     await user.bindPhone({
        ...params
      })
      Toast.success('绑定成功！')
      history.goBack()
    } finally {
    }
  }
  return (
    <div>
      <NavBar title="验证手机号码" center/>
      <div className="profile-container">
        <BoundPhone
          type={"bound"}
          onSubmit={(phoneInfo: any) => {
            handleVerify({
              countryCode: phoneInfo.countryCode,
              phone: phoneInfo.phone,
              captcha: phoneInfo.code
            })
          }}
        />
      </div>
    </div>
  );
}

export default VerifyPhone;
