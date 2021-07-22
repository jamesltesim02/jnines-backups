import React, { useState } from 'react';
import Form, { useForm, Field } from "../../../../components/Form";
import { Link } from "react-router-dom";
import { j9RegisterReg, registerPasswordReg } from "../../../../consts/regexr";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";

import CodeImg from "../../components/Input/img/code.png";
import J9Img from "../../components/Input/img/j9.png";
import CustomInput from "../../../../components/CustomInput";
import PasswordInput from "../../components/Input/PasswordInput";
import PhoneInput from "../../components/Input/PhoneInput";
import TextCaptcha from "../../components/TextCaptcha";


function RegisterNormal() {
  const [form] = useForm()
  const [user] = useApi([User])

  const [countryCode, setCountryCode] = useState('')
  const [refreshVer, setRefreshVer] = useState(0)

  const onFinish = (
    {
      loginName,
      password,
      code,
      phone,
      recommendcode,
    }: Record<string, string>
  ) => {
    user.register({
      loginName: loginName.substring(2),
      password,
      code,
      phone,
      recommendcode,
      countryCode,
      currency: 1
    })
  }
  return (
    <div className="acc-container register-normal">
      <Form
        form={form}
        onFinish={onFinish}
      >
        <Field
          name="loginName"
          label="游戏账号"
          trim
          rules={[{required: true, pattern: j9RegisterReg,message: '账号需要以 j9 开头加6～14位字母和数字'}]}
        >
          <CustomInput
            required={true}
            maxLength={16}
            before={<img src={J9Img} alt="" style={{height: "15px"}}/>}
            placeholder="请输入以j9开头的游戏账号"
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
          rules={[{required: true}]}
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
        {/*文字点击验证码*/}
        <TextCaptcha
          refreshVer={refreshVer}
          type="REGISTER"
        />
        <button className="acc-button">注册</button>
      </Form>
      <div className="register-normal-footer">
        已有账号？
        <Link to={'/login'}>
          在此登录
        </Link>
      </div>
    </div>
  );
}

export default RegisterNormal;