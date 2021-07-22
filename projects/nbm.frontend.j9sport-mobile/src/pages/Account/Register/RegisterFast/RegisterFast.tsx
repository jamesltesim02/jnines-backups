import React, { useEffect, useState } from 'react';

import { useApi } from "../../../../apis";
import User from "../../../../apis/User";
import memberStore from "../../../../stores/member";
import { registerPasswordRules } from "../../../../consts/regexr";

import Form, { useForm, Field } from "../../../../components/Form";
import PhoneInput from "../../components/Input/PhoneInput";
import PasswordInput from "../../components/Input/PasswordInput";
import AccountFooter from "../../components/AccountFooter";
import CaptchaInput from "../../components/Input/CaptchaInput";
import { Toast } from "antd-mobile";


function RegisterFast() {
  const [form] = useForm()
  const [user] = useApi([User])
  const [countryCode, setCountryCode] = useState('')
  const [refreshVer, setRefreshVer] = useState(0)

  const onSelected = (val: string) => {
    setCountryCode(val)
  }

  const onFinish = (
    {
      phone,
      password,
      code
    }: any
  ) => {
    user.registerFast(
      {
        phone,
        countryCode,
        password,
        code,
        currency: memberStore.currency
      }
    ).then((res: any) => {
      console.log(res)
    }).finally(() => {
      setRefreshVer(refreshVer + 1)
    })
  }


  return (
    <div className="acc-container pt25">
      <Form
        form={form}
        onFinish={onFinish}
      >
        <Field
          name="phone"
          label="手机号码"
          rules={[{required: true}]}
        >
          <PhoneInput onSelected={onSelected} />
        </Field>
        <Field
          name="password"
          label="密码"
          rules={registerPasswordRules}
        >
          <PasswordInput />
        </Field>
          <Field
            trim
            name="code"
            label="验证码"
            rules={[{required: true}]}
          >
            <CaptchaInput refreshVer={refreshVer} type="register" />
          </Field>
        <button className="acc-button">注册</button>
      </Form>
      <AccountFooter type="login" />
    </div>
  );
}

export default RegisterFast;