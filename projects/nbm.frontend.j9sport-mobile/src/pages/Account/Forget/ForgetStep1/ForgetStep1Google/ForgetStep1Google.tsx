import React, { useState } from 'react';

import { Tabs } from "antd-mobile";
import Form, { Field, useForm } from "../../../../../components/Form";
import PhoneInput from "../../../components/Input/PhoneInput";
import GoogleInput from "../../../components/Input/GoogleInput";
import UsernameInput from "../../../components/Input/UsernameInput";
import { useApi } from "../../../../../apis";
import User from "../../../../../apis/User";
import { Toast } from "antd-mobile/es";

const tabs = [
  {title: '手机号码'},
  {title: '游戏账号'},
]

function ForgetStep1Google(
  {
    nextStep
  }: {
    nextStep?: any
  }
) {

  const [form] = useForm()
  const [user] = useApi([User])
  const [countryCode, setCountryCOde] = useState('+86')

  const onFinish = async (params: {
    loginName: string
    countryCode?: string
    code: string
  }) => {
    try {
      Toast.loading('验证中...')
      await user.googleVerify({
        ...params,
        type: "forgot"
      })
      nextStep(params.loginName,countryCode)
      Toast.hide()
    } finally {

    }
  }
  return (
    <div>
      <Tabs
        tabs={tabs}
        initialPage={0}
        swipeable={false}
        animated={false}
      >
        <div>
          <Form
            form={form}
            onFinish={(data: any) => {
              onFinish({...data, countryCode})
            }}
          >
            <Field
              name="loginName"
              label="手机号码"
              trim
              rules={[{required: true}]}
            >
              <PhoneInput onSelected={(code: string) => setCountryCOde(code)}/>
            </Field>
            <Field
              name="code"
              label="谷歌验证码"
              trim
              rules={[{required: true}]}
            >
              <GoogleInput/>
            </Field>
            <button className="acc-button">下一步</button>
          </Form>
        </div>
        <div>
          <Form
            form={form}
            onFinish={(data: any) => {
              onFinish(data)
            }}
          >
            <Field
              name="loginName"
              label="游戏账号"
              trim
              rules={[{required: true}]}
            >
              <UsernameInput/>
            </Field>
            <Field
              name="code"
              label="谷歌验证码"
              trim
              rules={[{required: true}]}
            >
              <GoogleInput/>
            </Field>
            <button className="acc-button">下一步</button>
          </Form>
        </div>
      </Tabs>
    </div>
  );
}

export default ForgetStep1Google;