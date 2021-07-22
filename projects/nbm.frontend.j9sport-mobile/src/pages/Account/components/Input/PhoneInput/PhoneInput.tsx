import React from 'react';

import CustomInput from "../../../../../components/CustomInput";
import CountryCode from "../../../../../components/CountryCode";

function PhoneInput(
  {
    value,
    onChange,
    message,
    onSelected,
    onBlur,
    required
  }: {
    value?: string
    onChange?: Function
    message?: any
    onSelected: Function
    onBlur?: Function
    required? :boolean
  }
) {

  const before = <CountryCode onSelected={onSelected}/>

  return (
    <>
      <CustomInput
        type={"tel"}
        value={value}
        onChange={onChange}
        before={before}
        placeholder="请输入手机号码"
        message={message}
        onBlur={onBlur}
        required={required}
      />
    </>
  );
}

export default PhoneInput;