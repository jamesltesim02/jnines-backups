import React from 'react';
import codeImg from '../img/code.png';
import CustomInput from "../../../../../components/CustomInput/CustomInput";

function CodeInput(
  {
    value,
    onChange,
    onBlur,
    message
  }: {
    value?: number
    onChange?: Function
    message? : any
    onBlur?: Function,
  }
) {
  const before = <img src={codeImg} alt="" />
  return (
    <CustomInput
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      message={message}
      before={before}
      placeholder="请输入推荐码，可不填写"
    />
  )
}


export default CodeInput;