import React from 'react';

import CustomInput from "../../../../../components/CustomInput";
import CaptchaImg from "../img/verify.png";
import ImageCaptcha from "../../ImageCaptcha";

function CaptchaInput(
  {
    type,
    value,
    onChange,
    onBlur,
    message,
    refreshVer,
    maxLength
  }: {
    type: 'register' | 'login'
    value?: number
    onChange?: Function
    message? : any
    onBlur?: Function
    refreshVer?: number
    maxLength?: number
  }
) {
  return (
    <CustomInput
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      message={message}
      className="captcha-input"
      placeholder="请输入验证码"
      before={<img src={CaptchaImg} alt="" />}
      after={<ImageCaptcha refreshVer={refreshVer} type={type} />}
      maxLength={maxLength}
    />
  );
}

export default CaptchaInput;