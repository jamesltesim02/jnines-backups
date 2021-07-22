import React, { useEffect, useState } from 'react';
import mergeClass from "../../../utils/mergeClass";
import { Form, Input } from "antd";
import { useApi } from "../../../apis";
import User from "../../../apis/User";
import memberStore from "../../../stores/member";

import M from '../../common/m';

import FormItem from "../common/FormItem/FormItem";
import LoadingBar from "../../common/LoadingBar";
import { registerPasswordReg } from "../../../consts/regexr";
import ImageSuccess from "../img/success.svg";
import OnlineCustomerService from '../../common/OnlineCustomerService';
import { useIntl } from 'react-intl';

enum FORGET_TYPE {
  GOOGLE,
  MESSAGE
}

const tabs: Array<{ title: string, type: number }> = [
  {title: 'member.form.googleVerify', type: FORGET_TYPE.GOOGLE},
  {title: 'member.form.smsVerify', type: FORGET_TYPE.MESSAGE}
]

// 手机/用户名登录
enum ACC_TYPE {
  PHONE,
  USERNAME
}

enum STEP {
  VERIFY,
  CHANGE,
  SUCCESS
}

const accTabs: Array<{ title: string, type: number }> = [
  {title: 'member.form.phone', type: ACC_TYPE.PHONE},
  {title: 'member.form.username', type: ACC_TYPE.USERNAME}
]

function Forget() {
  const intl = useIntl();
  const [user] = useApi([User])
  const [form] = Form.useForm()
  const [forgetType, setForgetType] = useState(FORGET_TYPE.GOOGLE)
  const [accType, setAccType] = useState<ACC_TYPE>(ACC_TYPE.PHONE)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(STEP.VERIFY)
  const [changeParams, setChangeParams] = useState({
    countryCode: '',
    phone: ''
  })

  const handleVerify = async (formData: any) => {
    const {loginName, countryCode, code} = formData
    if (loading) {
      return;
    }
    try {
      setLoading(true)
      if (forgetType === FORGET_TYPE.GOOGLE) {
        await user.googleVerify({
          ...formData,
          type: 'forgot'
        })
      }
      if (forgetType === FORGET_TYPE.MESSAGE) {
        await user.smsVerify(
          {
            countryCode,
            code,
            phone: formData.loginName,
            type: 'forgot'
          }
        )
      }
      setChangeParams({
        countryCode: countryCode || '',
        phone: loginName
      })
      setStep(STEP.CHANGE)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = async (formData: any) => {
    if (loading) {
      return
    }
    try {
      setLoading(true)
      await user.resetPassword({
        ...formData,
        ...changeParams
      })
      setStep(STEP.SUCCESS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (forgetType === FORGET_TYPE.MESSAGE) {
      setAccType(ACC_TYPE.PHONE)
    }
  }, [forgetType])

  if (step === STEP.SUCCESS) {
    return (
      <div className="forget-success">
        <p><M id="member.message.passUpdateTitle" /></p>
        <img src={ImageSuccess} alt=""/>
        <p style={{color: '#67CA2C',fontSize: 16,marginBottom: 30}}>
          <M id="member.message.passUpdatedTip" />
        </p>
        <button
          className="btn-submit"
          onClick={() => memberStore.goLogin()}
        >
          <M id="member.form.toLogin4Forgot" />
        </button>
        <OnlineCustomerService className="contact-customer" />
      </div>
    )
  }

  return (
    <>
      {
        step === STEP.CHANGE ?
          <>
            <div className="account-header">
              <div
                className="active"
                dangerouslySetInnerHTML={{
                  __html: intl.formatMessage({ id: 'member.form.newPassTitle' })
                }}
              />
            </div>
            <Form
              name="forget"
              onFinish={handleChange}
              className="account-form"
            >
              <Form.Item
                colon={false}
                label={intl.formatMessage({ id: 'member.form.newPassLabel' })}
                name="password"
                rules={[
                  {required: true, message: intl.formatMessage({ id: 'member.form.newPassRequired' })},
                  {pattern: registerPasswordReg, message:  intl.formatMessage({ id: 'member.form.newPassInvalid' })}
                ]}
              >
                <Input.Password
                  allowClear
                  style={{width: 340}}
                  className="form-input"
                  placeholder={intl.formatMessage({ id: 'member.form.newPassInvalid' })}
                />
              </Form.Item>
              <Form.Item
                colon={false}
                label={intl.formatMessage({ id: 'member.form.confirmPassLabel' })}
                name="passwordCheck"
                dependencies={['password']}
                rules={[
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'member.form.passNotEqual' }))
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  allowClear
                  style={{width: 340}}
                  className="form-input"
                  placeholder={intl.formatMessage({ id: 'member.form.confirmPassLabel' })}
                />
              </Form.Item>
              <Form.Item>
                <Form.Item>
                  <button className="btn-submit">
                    {
                      !loading
                      ? intl.formatMessage({ id: 'member.form.submit' })
                      : < LoadingBar/>
                    }
                  </button>
                </Form.Item>
              </Form.Item>
            </Form>
          </>
          :
          <>
            {/*验证方式选择*/}
            <div className="account-header">
              {
                tabs.map((item: any) => (
                  <div
                    key={item.type}
                    className={mergeClass({
                      active: forgetType === item.type
                    })}
                    onClick={() => setForgetType(item.type)}
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({ id: item.title })
                    }}
                  />
                ))
              }
            </div>
            {/*手机号码/游戏账户登录选择*/}
            <div className="account-header-xs">
              {
                accTabs.map((item: any) => (
                  <div
                    key={item.type}
                    className={mergeClass({
                      active: accType === item.type
                    })}
                    onClick={() => setAccType(item.type)}
                    style={
                      forgetType === FORGET_TYPE.MESSAGE
                      && item.type === ACC_TYPE.USERNAME
                        ? {display: 'none'} : {}
                    }
                  >
                    <M id={item.title} />
                  </div>
                ))
              }
            </div>
            <Form
              form={form}
              name="forget"
              className="account-form"
              onFinish={handleVerify}
            >
              {/*手机号|游戏账号*/}
              {
                accType === ACC_TYPE.PHONE
                  ? <FormItem.Phone form={form}/>
                  : <FormItem.Username/>
              }
              <label>
                {
                  intl.formatMessage({
                    id: `member.form.${forgetType === FORGET_TYPE.MESSAGE ? 'smsCode' : 'googleCode'}`
                  })
                }
                {
                  forgetType === FORGET_TYPE.GOOGLE
                    ? <FormItem.Google name="code"/>
                    : <FormItem.Message form={form} type='forgot'/>
                }
              </label>
              <Form.Item>
                <button className="btn-submit">
                  {!loading ? <M id="member.form.nextStep" /> : < LoadingBar/>}
                </button>
              </Form.Item>
            </Form>
          </>
      }
      <div className='account-footer'>
        <span
          onClick={() => memberStore.goLogin()}
        >
          <M id="member.form.toLogin4Forgot" />
        </span>
        <div
          onClick={() => memberStore.goRegister()}
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({ id: 'member.form.toRegister' })
          }}
        />
      </div>
      <OnlineCustomerService className="contact-customer" />
    </>
  );
}

export default Forget;