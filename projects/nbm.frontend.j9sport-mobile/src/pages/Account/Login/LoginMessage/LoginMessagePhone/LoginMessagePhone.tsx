import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { useApi } from "../../../../../apis";
import User from "../../../../../apis/User";
import memberStore from "../../../../../stores/member";
import { CAPTCHA_TYPE, USER_STATUS_CODE } from "../../../../../consts/statusCode";
import { numberReg, phoneNumberReg } from "../../../../../consts/regexr";

import Form, { Field, useForm } from "../../../../../components/Form";
import PhoneInput from "../../../components/Input/PhoneInput";
import VerifyInput from "../../../components/Input/VerifyInput";
import CaptchaInput from "../../../components/Input/CaptchaInput";
import UsernameInput from "../../../components/Input/UsernameInput";
import TextCaptcha from "../../../components/TextCaptcha";
import CurrencySelect from "../../../components/CurrencySelect";

const {CAPTCHA} = USER_STATUS_CODE

function LoginMessagePhone(
  {
    type
  }: {
    type: 'phone' | 'username'
  }
) {
  const [user] = useApi([User])
  const history = useHistory()
  const [form] = useForm()
  const [refreshVer, setRefreshVer] = useState(0)
  const [captcha, setCaptcha] = useState({visible: false,type: 0})
  const [imageCaptchaCode, setImageCaptchaCode] = useState('')

  const [params, setParams] = useState<any>(
    {
      countryCode: '',
      loginName: ''
    }
  )

  const onFinish = (val: any) => {
    const {code, currency} = val
    let data = {
      ...params,
      currency,
      code: code || imageCaptchaCode,
    }
    if (type === "username") {
      delete data.loginName
    }

    Toast.loading('登录中...', 0)
    user.smsLogin(data).then((res: any) => {
      Toast.success('登录成功')
      memberStore.login({
        ...res,
        userId: res.nbUserId,
        customerId: res.loginName
      })
      history.push('/')
    }).catch((err: any) => {
      // 验证码相关
      if (err && Object.keys(CAPTCHA).includes(err.code?.toString())) {
        // 图片验证码
        if (err.code === CAPTCHA_TYPE.IMAGE) {
          Toast.hide()
          setCaptcha({
            visible: true,
            type: CAPTCHA_TYPE.IMAGE
          })
        }
        // 文字点击验证码
        if (err.code === CAPTCHA_TYPE.TEXT) {
          Toast.hide()
          setCaptcha({
            visible: true,
            type: CAPTCHA_TYPE.TEXT
          })
        }
      }
    }).finally(() => {
      if (captcha.visible) {
        setRefreshVer(refreshVer => refreshVer + 1)
      }
    })
  }

  const onSelected = (countryCode: string) => {
    // 设置区号
    setParams(
      {
        ...params,
        countryCode
      }
    )
  }

  const onChange = ({loginName}: any) => {
    // 设置手机号码
    setParams(
      {
        ...params,
        loginName
      }
    )
  }

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        onChange={onChange}
      >
        {
          type === 'phone' ?
            <Field
              name="loginName"
              label="手机号码"
              rules={[{
                required: true,
                pattern: params.countryCode === "+86" ? phoneNumberReg : numberReg,
                message: "请输入正确的手机号码"
              }]}
            >
              <PhoneInput onSelected={onSelected}/>
            </Field>
            :
            <Field
              name="loginName"
              label="游戏账号"
              rules={[{required: true}]}
              trim
            >
              <UsernameInput/>
            </Field>
        }
        <Field
          name="code"
          label="手机验证码"
          rules={[{required: true}]}
        >
          <VerifyInput
            params={params}
            type="login"
            validateList={["loginName"]}
          />
        </Field>
        <Field
          defaultValue={2}
          name={"currency"}
          label={''}
        >
          <CurrencySelect />
        </Field>
        {
          captcha.visible
          && captcha.type === CAPTCHA_TYPE.IMAGE ?
            <Field
              trim
              name="verification"
              label="验证码"
              rules={[{required: true}]}
            >
              <CaptchaInput refreshVer={refreshVer} type="login" />
            </Field> : <></>
        }
        {
          captcha.visible
          && captcha.type === CAPTCHA_TYPE.TEXT ?
            <TextCaptcha
              refreshVer={refreshVer}
              type="LOGIN"
              onSuccess={(code: string) => setImageCaptchaCode(code)}
            /> : <></>
        }
        <button className="acc-button">
          登录
        </button>
      </Form>
    </div>
  );
}

export default observer(LoginMessagePhone);