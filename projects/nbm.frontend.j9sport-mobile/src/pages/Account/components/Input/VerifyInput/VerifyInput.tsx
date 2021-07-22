import React, { useContext, useEffect, useState } from 'react';
import FieldContext from "../../../../../components/Form/FieldContext";

import LoadingBar from "../../../../../components/common/LoadingBar";
import CustomInput from "../../../../../components/CustomInput/CustomInput";
import PhoneImg from "../img/verify.png"
import { Toast } from "antd-mobile";
import { useApi } from "../../../../../apis";
import User from "../../../../../apis/User";

function VerifyInput(
  {
    params,
    type,
    value,
    onChange,
    message,
    // 单独表单验证的namelist
    validateList,
    onBlur,
  }: {
    params: any
    type: 'login' | 'forgot' | 'change_phone_old' | 'change_phone_new' | 'register' | 'bound' | 'bank'
    value?: string
    onChange?: Function
    message?: any
    validateList?: string[]
    onBlur?: Function
  }
) {
  const context = useContext(FieldContext) as any
  const before = <img src={PhoneImg} alt=""/>
  const [loading, setLoading] = useState(false)
  const [user] = useApi([User])
  const [codeCount, setCodeCount] = useState(0)

  const smsSend = () => {
    user.smsSend(
      {
        ...params,
        type
      }
    ).then((res: any) => {
      Toast.success('发送成功')
      setCodeCount(300)
    }).catch((err: any) => {
      if (err) {
        Toast.fail(err.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const loginSmsSend = () => {
    user.smsLoginSend(
      {
        ...params,
        type
      }
    ).then((res: any) => {
      if (res) {
        setCodeCount(300)
        Toast.success('发送成功')
      }
    }).catch((err: any) => {
      if (err) {
        Toast.fail(err.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  // 发送验证码
  const onSendCode = (err: any) => {
    if (Object.keys(err).length === 0) {
      setLoading(true)
      if (type === 'login') {
        // 登录
        loginSmsSend()
      }else {
        smsSend()
      }
    }
  }

  useEffect(() => {
    codeCount > 0
    &&
    setTimeout(() => {
      setCodeCount(() => codeCount - 1)
    },1000)
  },[codeCount])

  return (
    <div className="phone-verify">
      <CustomInput
        value={value}
        onChange={onChange}
        before={before}
        placeholder="请输入手机动态码"
        maxLength={6}
        message={message}
        onBlur={onBlur}
      />
      {
        codeCount && codeCount > 0
          ? <button className="disabled">重发({codeCount}S)</button>
          : <button
            type="button"
            onClick={() => !loading && onSendCode(context.validate(validateList))}
          >
            {loading ? <LoadingBar/> : "发送验证码"}
          </button>
      }
    </div>
  );
}

export default VerifyInput;