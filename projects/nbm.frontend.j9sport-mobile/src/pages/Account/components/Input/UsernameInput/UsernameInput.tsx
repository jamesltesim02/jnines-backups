import React from 'react';
import CustomInput from "../../../../../components/CustomInput/CustomInput";
import usernameImg from "../img/username.png";

function UsernameInput(
  {
    value,
    onChange,
    message,
    onBlur
  }: {
    value?: string
    onChange?: Function
    message?: any
    onBlur?: Function
  }
) {
  const before = <img src={usernameImg} alt=""/>

  return (
    <>
      <CustomInput
        value={value}
        onChange={onChange}
        before={before}
        placeholder="请输入游戏账号"
        message={message}
        onBlur={onBlur}
      />
    </>
  );
}

export default UsernameInput;