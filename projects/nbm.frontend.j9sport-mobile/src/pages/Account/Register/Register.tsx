import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useApi } from '../../../apis';
import User from '../../../apis/User';
import memberStore from '../../../stores/member';
import appStore from '../../../stores/app';
import { Toast } from 'antd-mobile';
import mergeClass from '../../../utils/mergeClass';

import NavBar from '../../../components/common/NavBar';
import Form, { Field, useForm } from '../../../components/Form';
import PhoneInput from '../components/Input/PhoneInput';
import { j9RegisterReg, registerPasswordReg, registerPasswordRules, phoneNumberReg, numberReg } from '../../../consts/regexr';
import PasswordInput from '../components/Input/PasswordInput';
import CaptchaInput from '../components/Input/CaptchaInput';
import TextCaptcha from '../components/TextCaptcha';
import AccountFooter from '../components/AccountFooter';
import CustomInput from '../../../components/CustomInput';
import J9Img from '../components/Input/img/j9.png';
import CodeImg from '../components/Input/img/code.png';

enum REGISTER_TYPE {
  FAST,
  NORMAL
}

enum CAPTCHA_TYPE {
  NO = 1,
  IMAGE,
  TEXT
}

const tabs: Array<{ title: string, type: number }> = [
  {title: "快速注册", type: REGISTER_TYPE.FAST},
  {title: "普通注册", type: REGISTER_TYPE.NORMAL},
]

function Register() {
  const [user] = useApi([User])
  const [form] = useForm()
  const history = useHistory()
  const [countryCode, setCountryCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [registerType, setRegisterType] = useState<REGISTER_TYPE>(REGISTER_TYPE.FAST)
  const [refreshVer, setRefreshVer] = useState(0)
  const [captchaType, setCaptchaType] = useState(CAPTCHA_TYPE.NO)
  const [imageCaptchaCode, setImageCaptchaCode] = useState('')

  const onSelected = (val: string) => {
    setCountryCode(val)
  }

  const onFinish = async (formData: any) => {

    if (loading) {
      return;
    }

    if (captchaType !== CAPTCHA_TYPE.NO) {
      formData.code = formData.code || imageCaptchaCode
    }

    try {
      setLoading(true)
      let regRes: any = null;
      if (registerType === REGISTER_TYPE.FAST) {
        regRes = await user.registerFast(
          {
            ...formData,
            countryCode,
            currency: memberStore.currency,
            domainName: appStore.origin || ''
          }
        )
      }
      if (registerType === REGISTER_TYPE.NORMAL) {
        regRes = await user.register({
          ...formData,
          countryCode,
          recommendcode: formData.recommendcode || '',
          loginName: formData.loginName.substring(2),
          currency: memberStore.currency,
          domainName: appStore.origin || ''
        })
      }
      if (regRes) {
        Toast.success(
          '注册成功',
          1,
          () => {
            memberStore.login({
              ...regRes,
              userId: regRes.nbUserId,
              customerId: regRes.loginName
            })
            history.push('/')
          }
        )
      }
    } finally {
      setLoading(false)
      setRefreshVer(refreshVer + 1)
    }
  }
  // 获取注册验证码类型
  useEffect(() => {
    user.captchaType().then((res: any) => {
      setCaptchaType(res.registerVerificationType)
    })
  }, [])

  useEffect(() => {
    setFormKey( formKey + 1)
  },[registerType])

  return (
    <div className="register">
      <NavBar title="注册" center={true}/>
      <div className="acc-header">
        {
          tabs.map((item: any) => (
            <div
              key={item.type}
              className={mergeClass({
                active: registerType === item.type
              })}
              onClick={() => setRegisterType(item.type)}
            >
              {item.title}
            </div>
          ))
        }
      </div>
      <div className="acc-container pt25">
        <Form
          key={formKey}
          form={form}
          onFinish={onFinish}
        >
          {
            registerType === REGISTER_TYPE.FAST ?
              <>
                <Field
                  name="phone"
                  label="手机号码"
                  rules={[{required: true,pattern:countryCode === "+86" ? phoneNumberReg : numberReg, message: "请输入正确的手机号码"}]}
                >
                  <PhoneInput onSelected={onSelected}/>
                </Field>
                <Field
                  name="password"
                  label="密码"
                  rules={registerPasswordRules}
                >
                  <PasswordInput/>
                </Field>
              </>
              :
              <>
                <Field
                  name="loginName"
                  label="游戏账号"
                  trim
                  rules={[{required: true, pattern: j9RegisterReg,message: '账号需要以 j9 开头加8-12位字母数字'}]}
                >
                  <CustomInput
                    required={true}
                    maxLength={16}
                    placeholder="请输入以j9开头8-12位字母数字"
                  />
                </Field>
                <Field
                  name="password"
                  label="密码"
                  trim
                  rules={[{required: true, pattern: registerPasswordReg, message: '密码需8～14位字母和数字'}]}
                >
                  <PasswordInput placeholder="密码8～14位字母和数字" required={true} />
                </Field>
                <Field
                  name="phone"
                  label="手机号码"
                  trim
                  rules={[{required: true,pattern:countryCode === "+86" ? phoneNumberReg : numberReg, message: "请输入正确的手机号码"}]}
                >
                  <PhoneInput
                    required={true}
                    onSelected={(countryCode: string) => {setCountryCode(countryCode)}}
                  />
                </Field>
                <Field
                  name="recommendcode"
                  label="推荐码"
                >
                  <CustomInput
                    before={<img src={CodeImg} alt="" />}
                    placeholder="请输入推荐码，可不填写"
                  />
                </Field>
              </>
          }
          {
            captchaType === CAPTCHA_TYPE.IMAGE ?
              <Field
                trim
                name="code"
                label="验证码"
                rules={[{required: true}]}
              >
                <CaptchaInput
                  refreshVer={refreshVer}
                  type="register"
                  maxLength={6}
                />
              </Field> : <></>
          }
          {
            captchaType === CAPTCHA_TYPE.TEXT ?
              <TextCaptcha
                refreshVer={refreshVer}
                type="REGISTER"
                onSuccess={(code: string) => setImageCaptchaCode(code)}
              /> : <></>
          }
          <button className="acc-button">注册</button>
        </Form>
        <AccountFooter type="login"/>
      </div>
    </div>
  );
}

export default Register;