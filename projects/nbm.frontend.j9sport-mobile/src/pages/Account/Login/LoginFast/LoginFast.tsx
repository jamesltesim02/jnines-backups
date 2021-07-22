import React, { useState } from 'react';
import { Toast } from "antd-mobile";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { USER_STATUS_CODE, CAPTCHA_TYPE } from "../../../../consts/statusCode";
import { loginPasswordRules, numberReg, phoneNumberReg } from "../../../../consts/regexr";

import { useApi } from "../../../../apis";
import User from "../../../../apis/User";
import memberStore from "../../../../stores/member";

import AccountFooter from "../../components/AccountFooter";
import AccountHeader from "../../components/AccountHeader";
import Form, { Field, useForm } from "../../../../components/Form";
import PhoneInput from "../../components/Input/PhoneInput";
import PasswordInput from "../../components/Input/PasswordInput";
import CaptchaInput from "../../components/Input/CaptchaInput";
import TextCaptcha from "../../components/TextCaptcha";
import UsernameInput from "../../components/Input/UsernameInput";
import CurrencySelect from "../../components/CurrencySelect";

const tabs = [
  {title: "手机号码"},
  {title: "游戏账号"}
]

const {CAPTCHA} = USER_STATUS_CODE

function LoginFast() {
  const [user] = useApi([User])
  const [form] = useForm()
  const history = useHistory()

  const [countryCode, setCountryCode] = useState<any>()
  const [captcha, setCaptcha] = useState({visible: false,type: 0})
  const [currentTab, setCurrentTab] = useState(0)
  const [refreshVer, setRefreshVer] = useState(0)
  const [imageCaptchaCode, setImageCaptchaCode] = useState('')
  const [imageCaptchaStatus, setImageCaptchaStatus] = useState(false)

  // 登录请求
  const login = ((params: any) => {
    if (captcha.type === CAPTCHA_TYPE.TEXT && !imageCaptchaStatus) {
      Toast.fail("请先点击验证")
      return;
    }
    Toast.loading("登录中...",0)
    user.login(params).then((res: any) => {
      Toast.success('登录成功')
      memberStore.login({
        ...res,
        userId: res.nbUserId,
        customerId: res.loginName
      })
      history.push('/')
    }).catch((err: any) => {
      if (!err) {
        return ;
      }
      // 验证码相关
      if (Object.keys(CAPTCHA).includes(err.code?.toString())) {
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
      setImageCaptchaStatus(false)
    }).finally(() => {
      if (captcha.visible) {
        setRefreshVer((refreshVer) => refreshVer + 1)
      }
    })
  })

  // 手机登录
  const onPhoneFinish = (val: any) => {
    const {phoneNumber, password, verification, currency} = val
    const params = {
      countryCode,
      password,
      currency,
      verification: verification || imageCaptchaCode,
      loginName: phoneNumber,
    }
    login(params)
  }

  // 用户名登录
  const onUsernameFinish = (val: any) => {
    const {loginName, password, verification, currency} = val
    const params = {
      loginName,
      password,
      currency,
      verification: verification || imageCaptchaCode,
    }
    login(params)
  }

  return (
    <div className="acc-container">
      <AccountHeader tabs={tabs} onChange={(index: number) => setCurrentTab(index)}/>
      <Form
        form={form}
        onFinish={currentTab === 0 ? onPhoneFinish : onUsernameFinish}
      >
        {
          currentTab === 0 ?
          <Field
            trim
            name="phoneNumber"
            label="手机号码"
            rules={[{required: true, pattern:countryCode === "+86" ? phoneNumberReg : numberReg, message: "请输入正确的手机号码"}]}
          >
            <PhoneInput onSelected={(countryCode: string) => {setCountryCode(countryCode)}} />
          </Field> :
          <Field
            trim
            name="loginName"
            label="游戏账号"
            rules={[{required: true}]}
          >
            <UsernameInput />
          </Field>
        }
        <Field
          trim
          name="password"
          label="游戏密码"
          rules={loginPasswordRules}
        >
          <PasswordInput placeholder={loginPasswordRules[0].message} />
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
        <Field
          defaultValue={2}
          name={"currency"}
          label={''}
        >
          <CurrencySelect />
        </Field>
        {
          captcha.visible
          && captcha.type === CAPTCHA_TYPE.TEXT ?
            <TextCaptcha
              type="LOGIN"
              refreshVer={refreshVer}
              onSuccess={(code: string) => {
                setImageCaptchaCode(code)
                setImageCaptchaStatus(true)
              }}
            /> : <></>
        }
        <button className="acc-button">
          登录
        </button>
      </Form>
      <AccountFooter type={"forget-register"} />
    </div>
  );
}

export default observer(LoginFast);