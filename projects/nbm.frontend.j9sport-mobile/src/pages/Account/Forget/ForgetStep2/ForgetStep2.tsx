import React, { useState } from 'react';
import { Link } from "react-router-dom";
import LoadingBar from "../../../../components/common/LoadingBar";

import { registerPasswordRules } from "../../../../consts/regexr";
import Form,{ useForm, Field } from "../../../../components/Form";
import PasswordInput from "../../components/Input/PasswordInput";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";


/**
 * 设置新密码
 * @constructor
 */
function ForgetStep2(
  {
    nextStep,
    params
  }: {
    nextStep: Function
    params: {
      phone: string
      countryCode: string
    }
  }
) {
  const [form] = useForm()
  const [user] = useApi([User])
  const [checkMessage, setCheckMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const resetPassword = (val: any) => {
    const {password, passwordCheck} = val

    if (password !== passwordCheck) {
      setCheckMessage('密码不一致，请重新输入')
      return ;
    }
    setLoading(true)
    user.resetPassword(
      {
        password,
        ...params
      }
    ).then((res: any) => {
      if (res) {
        nextStep()
      }
    }).catch((err: any) => {
      if (err) {
        setCheckMessage(err.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="acc-container step2">
      <Form
        form={form}
        onFinish={resetPassword}
      >
        <Field
          name="password"
          label="新密码"
          rules={registerPasswordRules}
        >
          <PasswordInput />
        </Field>
        <Field
          name="passwordCheck"
          label="确认密码"
          rules={registerPasswordRules}
          message={checkMessage}
        >
          <PasswordInput />
        </Field>
        <button
          className="acc-button"
        >
          {
            loading
              ? <LoadingBar/>
              : "下一步"
          }
        </button>
      </Form>
      <div className="acc-footer">
        <Link to={'/login'}>
          去登录
        </Link>
      </div>
    </div>
  );
}

export default ForgetStep2;