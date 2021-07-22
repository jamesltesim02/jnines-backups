import React from 'react';
import BoundPhone from "../components/BoundPhone";
import { Toast } from "antd-mobile";
import { useApi } from "../../../../../apis";
import User from "../../../../../apis/User";

function ChangePhoneStep1(
  {
    nextStep
  }: {
    nextStep: Function
  }
) {
  const [user] = useApi([User])

  const handleChangePhone = async (phoneInfo: any) => {
    try {
      Toast.loading('验证中...')
      // 验证手机号码
      await user.smsVerify({
        type: "change_phone_old",
        ...phoneInfo
      })
      Toast.hide()
      nextStep()
    } catch (e) {
      e && Toast.fail(e.msg)
    }
  }

  return (
    <div className="profile-container">
      <p>为确保是您本人操作，请在以下输入框完善信息后点击发送验证码</p>
      <BoundPhone
        type="CHANGE_PHONE_OLD"
        onSubmit={handleChangePhone}
      />
    </div>
  );
}

export default ChangePhoneStep1;