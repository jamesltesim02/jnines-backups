import React, { useState } from 'react';

import { Toast } from "antd-mobile";
import { CAPTCHA_TYPE, USER_STATUS_CODE } from "../../../../consts/statusCode";
import { useApi } from "../../../../apis";
import { useHistory } from "react-router-dom";
import User from "../../../../apis/User";
import memberStore from "../../../../stores/member";

import AccountFooter from "../../components/AccountFooter";
import AccountHeader from "../../components/AccountHeader";
import Form, { Field, useForm } from "../../../../components/Form";
import PhoneInput from "../../components/Input/PhoneInput";
import GoogleInput from "../../components/Input/GoogleInput";
import UsernameInput from "../../components/Input/UsernameInput";
import CaptchaInput from "../../components/Input/CaptchaInput";
import TextCaptcha from "../../components/TextCaptcha";
import CurrencySelect from "../../components/CurrencySelect";

const tabs = [
  {title: "手机号码"},
  {title: "游戏账号"}
]
const {CAPTCHA} = USER_STATUS_CODE

function LoginGoogle() {
  const history = useHistory()
  const [form] = useForm()
  const [user] = useApi([User])

  const [currentTab, setCurrentTab] = useState(0)
  const [captcha, setCaptcha] = useState({visible: false,type: 0})
  const [refreshVer, setRefreshVer] = useState(0)
  const [imageCaptchaCode, setImageCaptchaCode] = useState('')
  const [countryCode, setCountryCode] = useState('')

  const googleLogin = (params: {
    loginName: string
    authCode: string
    countryCode?: string
    verification?: string
    currency?: number
  }) => {

    Toast.loading('登录中...',0)
    user.googleLogin(
      {
        ...params,
      }
    ).then((res: any) => {
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
    }).finally(() => {
      if (captcha.visible) {
        setRefreshVer((refreshVer) => refreshVer + 1)
      }
    })
  }
  const phoneLogin = ({loginName, authCode, verification, currency}: any) => {
    googleLogin(
      {
        loginName,
        countryCode,
        authCode,
        currency,
        verification: verification || imageCaptchaCode
      }
    )
  }
  const usernameLogin = ({loginName, authCode, verification, currency}: any) => {
    googleLogin(
      {
        loginName,
        authCode,
        currency,
        verification: verification || imageCaptchaCode
      }
    )
  }

  return (
    <div className="acc-container">
      <AccountHeader tabs={tabs} onChange={(index: number) => setCurrentTab(index)}/>
        {/*手机号码登录*/}
        <div>
          <Form
            form={form}
            onFinish={currentTab === 0 ? phoneLogin : usernameLogin}
          >
            {
              currentTab === 0 ?
                <Field
                  name="loginName"
                  label="手机号码"
                  rules={[{required: true}]}
                >
                  <PhoneInput onSelected={(countryCode: string) => {setCountryCode(countryCode)}}/>
                </Field> :
                <Field
                  name="loginName"
                  label="游戏账号"
                  rules={[{required: true}]}
                >
                  <UsernameInput />
                </Field>
            }

            <Field
              name="authCode"
              label="谷歌验证码"
              rules={[{required: true}]}
            >
              <GoogleInput />
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
                  type="LOGIN"
                  onSuccess={(code: string) => setImageCaptchaCode(code)}
                  refreshVer={refreshVer}
                /> : <></>
            }
            <button className="acc-button">登录</button>
          </Form>
        </div>
      <AccountFooter type={"forget-register"} />
    </div>
  );
}

export default LoginGoogle;