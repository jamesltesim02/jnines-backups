import React, { PureComponent, useEffect, useState } from 'react';
import { Form, Input, message } from "antd";
import { useIntl } from 'react-intl';
import * as reg from "../../../../consts/regexr";
import mergeClass from "../../../../utils/mergeClass";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";

import CountryCode from "../../../common/CountryCode";
import ImageCaptcha from "../ImageCaptcha";
import TextCaptcha from "../TextCaptcha";

/** 手机号码 */
const Phone = (
  {
    form,
    name = 'loginName',
    hasFeedback, 
    width = 340
  }: any
) => {
  const intl = useIntl();
  const [countryCode, setCountryCode] = useState('+86')
  const phoneReg = countryCode === '+86' ? reg.phoneNumberReg : reg.numberReg

  useEffect(() => {
    form.setFieldsValue({ countryCode })
  }, [countryCode])

  return (
    <>
      <Form.Item
        hasFeedback={hasFeedback}
        name={name}
        rules={
          [
            { required: true, message: intl.formatMessage({ id: 'member.form.phoneRequired' }) },
            { pattern: phoneReg, message: intl.formatMessage({ id: 'member.form.phoneInvalid' }) }
          ]
        }
      >
        <Input
          style={{width: width}}
          addonBefore={<CountryCode onSelected={(code: string) => setCountryCode(code)}/>}
          className="form-input"
          type="number"
          placeholder={intl.formatMessage({ id: 'member.form.phonePlaceholder' })}
          allowClear
        />
      </Form.Item>
      <Form.Item
        name="countryCode"
        shouldUpdate
        hidden
      >
        <Input/>
      </Form.Item>
    </>
  )
}

/** 游戏账号 */
const Username = () => {
  const intl = useIntl();
  return (
    <Form.Item
      name="loginName"
      rules={[
        {required: true, message: intl.formatMessage({ id: 'member.form.usernameRequired' })}
      ]}
    >
      <Input
        className="form-input"
        type="text"
        placeholder={intl.formatMessage({ id: 'member.form.usernamePlaceholder' })}
        allowClear
      />
    </Form.Item>
  );
}

/** 登录密码 */
const Password = () => {
  const intl = useIntl();
  return (
    <Form.Item
      name="password"
      rules={[{required: true, message: intl.formatMessage({ id: 'member.form.passwordRequired'}) }]}
    >
      <Input.Password
        className="form-input"
        type="password"
        style={{width: 340}}
        placeholder={intl.formatMessage({ id: 'member.form.passwordPlaceholder' })}
        allowClear
      />
    </Form.Item>
  )
};

/** Google账号 */
const Google = (
  {
    name = 'authCode'
  }
) => {
  const intl = useIntl();
  return (
    <Form.Item
      name={name}
      rules={[
        {required: true, message: intl.formatMessage({ id: 'member.form.googleCodeRequired'})},
        {pattern: /^\d{6}$/, message: intl.formatMessage({ id: 'member.form.googleCodeInvalid'})}
      ]}
    >
      <Input
        className="form-input"
        type="number"
        style={{width: 340}}
        placeholder={intl.formatMessage({ id: 'member.form.googleCodePlaceholder'})}
        maxLength={6}
        allowClear
      />
    </Form.Item>
  )
}

/** 发送短信 */
const Message = (
  {
    form,
    name = 'code',
    phoneName = 'loginName',
    type,
    prefixPhone = ''
  }: {
    form: any,
    name?: string
    phoneName?: string
    type: 'login' | 'forgot' | 'change_phone_old' | 'CHANGE_PHONE_OLD' | 'change_phone_new' | 'register' | 'bound' | 'bank' | 'DCBOX' | 'GOOGLE_CHANGE' | 'GOOGLE_BIND'
    prefixPhone?: string
  }
) => {
  const intl = useIntl();
  const [user] = useApi([User])
  const [smsCountDown, setSmsCountDown] = useState(0)
  // 发送短信验证码
  const sendCode = async () => {
    if (smsCountDown > 0) {
      return;
    }
    // 验证手机号码是否输入
    try {
      const isPhoneEnter = await form.validateFields([phoneName])
      if (isPhoneEnter) {
        const formData = form.getFieldsValue(true)
        if (type === 'login') {
          await user.smsLoginSend({...formData})
        } else {
          await user.smsSend({
            ...formData,
            phone: prefixPhone + formData[phoneName],
            type
          })
        }
        // 发送短信验证码
        message.success(
          intl.formatMessage({ id: 'member.message.smsSuccess'})
        )
        setSmsCountDown(300)
      }
    } catch (e) {
      // 发送短信过于频繁
      if (e.code === 9639 || e.code === 6008) {
        setSmsCountDown(e.msg.replace(/[^0-9]/ig, ""))
      }
    }
  }

  useEffect(() => {
    if (smsCountDown <= 0) {
      return;
    }
    setTimeout(() => {
      setSmsCountDown(smsCountDown - 1)
    }, 1000)
  }, [smsCountDown])

  return (
    <div className="send-code">
      <Form.Item
        name={name}
        rules={[
          {required: true, message: intl.formatMessage({ id: 'member.form.smsCodeRequired'})},
          {pattern: /^\d{6}$/, message: intl.formatMessage({ id: 'member.form.smsCodeInvalid'})}
        ]}
      >
        <Input
          className="form-input"
          type="number"
          style={{width: 210}}
          maxLength={6}
          placeholder={intl.formatMessage({ id: 'member.form.smsCodePlaceholder'})}
          allowClear
        />
      </Form.Item>
      <button
        onClick={(event) => {
          event.preventDefault();
          sendCode();
        }}
        className={
          mergeClass({
            "send-code-btn": true,
            "active": smsCountDown > 0
          })
        }>
        {
          smsCountDown > 0
          ? intl.formatMessage(
              {id: 'member.form.resendSmsCode'},
              { seconds: smsCountDown }
            )
          : intl.formatMessage({ id: 'member.form.sendSmsCode'})
        }
      </button>
    </div>
  )
}

/** 图片验证码 */
const ImageVerify = (
  {
    name = 'verification',
    refreshVer = 0,
    type
  }: {
    name?: string
    refreshVer: number
    type: 'register' | 'login'
  }
) => {
  const intl = useIntl();
  return (
    <>
      <label>{intl.formatMessage({ id: 'member.form.captchaLabel'})}</label>
      <Form.Item
        name={name}
        rules={[
          {required: true, message: intl.formatMessage({ id: 'member.form.captchaRequired'}) },
        ]}
      >
        <Input
          className="form-input"
          placeholder={intl.formatMessage({ id: 'member.form.captchaPlaceholder'})}
          addonAfter={<ImageCaptcha refreshVer={refreshVer} type={type}/>}
          allowClear
        >
        </Input>
      </Form.Item>
    </>
  )
}

/** 文字点击验证码 */
const TextVerify = (
  {
    form,
    name = 'verification',
    refreshVer = 0,
    type
  }: {
    form: any
    name?: string
    refreshVer: number
    type: "REGISTER" | "LOGIN"
  }
) => {
  const intl = useIntl();
  return (
    <>
      <TextCaptcha
        refreshVer={refreshVer}
        type={type}
        onSuccess={(code: string) => {
          form.setFieldsValue({
            [name]: code
          })
        }}
      />
      <Form.Item
        name={name}
        rules={[
          {required: true, message: intl.formatMessage({ id: 'member.form.captchaRequired'})},
        ]}
        hidden
        shouldUpdate
      >
        <Input/>
      </Form.Item>
    </>
  )
}

class FormItem extends PureComponent {
  static Phone = Phone
  static Username = Username
  static Password = Password
  static Google = Google
  static Message = Message
  static ImageVerify = ImageVerify
  static TextVerify = TextVerify
}

export default FormItem;