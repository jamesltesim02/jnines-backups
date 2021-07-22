import React, { useEffect, useState } from 'react';

import { phoneNumberReg, numberReg } from "../../../../../consts/regexr";
import { Tabs, Toast } from "antd-mobile";
import Form, { useForm, Field } from "../../../../../components/Form";
import PhoneInput from "../../../components/Input/PhoneInput";
import VerifyInput from "../../../components/Input/VerifyInput";
import { useApi } from "../../../../../apis";
import User from "../../../../../apis/User";

const tabs = [
  {title: "手机号码"}
]

function ForgetStep1Message(
  {
    nextStep
  }: {
    nextStep?: Function
  }
) {
  const [form] = useForm()
  const [user] = useApi([User])
  const [params, setParams] = useState(
    {
      countryCode: '',
      phone: '',
    }
  )
  const [codeMessage, setCodeMessage] = useState('')

  // 验证验证码
  const onFinish = (val: any) => {
    const {phone, code} = val
    const {countryCode} = params
    user.smsVerify(
      {
        countryCode,
        phone,
        code,
        type: "forgot",
      }
    ).then((res: any) => {
      if (res) {
        nextStep && nextStep(phone, countryCode)
      }
    }).catch((err: any) => {
      if (err) {
        setCodeMessage(err.msg)
      }
    })
  }

  return (
    <div>
      <Tabs
        tabs={tabs}
      >
        <Form
          onFinish={onFinish}
          form={form}
          onChange={({phone}: any) => {
            setParams({
              ...params,
              phone,
            })
          }}
        >
          <Field
            name="phone"
            label="手机号码"
            rules={
              [{
                required: true,
                pattern: params.countryCode === "+86" ? phoneNumberReg : numberReg,
                message: "请输入正确的手机号码"
              }]
            }
          >
            <PhoneInput onSelected={(countryCode: string) => {
              setParams({
                ...params,
                countryCode,
              })
            }}/>
          </Field>
          <Field
            name="code"
            label="验证码"
            trim
            rules={[{required: true}]}
            message={codeMessage}
          >
            <VerifyInput
              params={params}
              type="forgot"
              validateList={['phone']}
            />
          </Field>
          <button className="acc-button">下一步</button>
        </Form>
      </Tabs>
    </div>
  );
}

export default ForgetStep1Message;