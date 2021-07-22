import React from 'react';

import CustomInput from "../../../../../components/CustomInput";
import GoogleImg from '../img/google.png'

function GoogleInput(
  {
    value,
    onChange,
    onBlur,
    message
  }: {
    value?: number
    onChange?: Function
    message? : any
    onBlur?: Function
  }
) {

  const before = <img src={GoogleImg} />

  return (
    <>
      <CustomInput
        type="tel"
        before={before}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        message={message}
        placeholder={"请输入谷歌验证器6位数字"}
        maxLength={6}
      />
    </>
  );
}

export default GoogleInput;