import React, { useState} from 'react';

import PasswordImg from "../img/password.png";
import EyeOpenImg from "../img/eye-open.png";
import EyeCloseImg from "../img/eye-close.png";
import CustomInput from "../../../../../components/CustomInput";

function PasswordInput(
  {
    value,
    onChange,
    message,
    onBlur,
    check,
    required,
    placeholder
  }: {
    value?: string
    onChange?: Function
    message?: any
    onBlur?: Function
    check?: boolean
    required?: boolean
    placeholder? :string
  }
) {

  const [type, setType] = useState('password')

  const before = (
    <img
      src={PasswordImg}
      alt=""
    />
    )
  const after = (
    <img
      src={type === 'password' ? EyeCloseImg : EyeOpenImg}
      style={{width: '20px'}}
      onClick={() => {
        type === 'password' ? setType('text') : setType("password")
      }}
      alt=""
    />
    )

  return (
    <>
      <CustomInput
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        before={before}
        after={after}
        placeholder={placeholder || "请输入6-14位字母数字"}
        maxLength={14}
        check={check || (!!value && !message)}
        message={message}
        required={required}
      />
    </>
  );
}

export default PasswordInput;