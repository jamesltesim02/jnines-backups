import React, { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import mergeClass from '../../../utils/mergeClass';
import { registerPasswordReg, j9RegisterReg } from '../../../consts/regexr';
import memberStore from '../../../stores/member';
import appStore from '../../../stores/app';
import { useApi } from '../../../apis';
import User from '../../../apis/User';

import M from '../../common/m';
import FormItem from '../common/FormItem/FormItem';
import LoadingBar from '../../common/LoadingBar';
import { useIntl } from 'react-intl';

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
  {title: 'member.form.quickRegister', type: REGISTER_TYPE.FAST},
  {title: 'member.form.normalRegister', type: REGISTER_TYPE.NORMAL},
]

const Register = () => {

  const intl = useIntl();
  const [form] = Form.useForm()
  const [user] = useApi([User])
  const [registerType, setRegisterType] = useState<REGISTER_TYPE>(REGISTER_TYPE.FAST)
  const [loading, setLoading] = useState(false)
  const [captchaType, setCaptchaType] = useState(CAPTCHA_TYPE.NO)
  const [refreshVer, setRefreshVer] = useState(0)

  const onFinish = async (formData: any) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true)
      let regRes: any = null;
      if (registerType === REGISTER_TYPE.FAST) {
        regRes = await user.registerFast(
          {
            ...formData,
            currency: memberStore.currency,
            domainName: appStore.origin || ''
          }
        )
      }
      if (registerType === REGISTER_TYPE.NORMAL) {
        regRes = await user.register({
          ...formData,
          recommendcode: formData.recommendcode || '',
          loginName: formData.loginName.substring(2),
          currency: memberStore.currency,
          domainName: appStore.origin || ''
        })
      }
      if (regRes) {
        message.success(
          intl.formatMessage({ id: 'member.message.registerSuccess' }),
          1,
          () => {
            memberStore.accountModal = {visible: false}
            memberStore.login(regRes)
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

  return (
    <>
      <div className="account-header register">
        {
          tabs.map((item: any) => (
            <div
              key={item.type}
              className={mergeClass({
                active: registerType === item.type
              })}
              onClick={() => setRegisterType(item.type)}
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: item.title })
              }}
            />
          ))
        }
      </div>
      <Form
        form={form}
        name="register"
        className="account-form"
        onFinish={onFinish}
      >
        {
          registerType === REGISTER_TYPE.FAST ?
            <>
              <label>*<M id="member.form.phone" /></label>
              <FormItem.Phone
                name="phone"
                form={form}
              />
              <label>*<M id="member.form.password" /></label>
              <Form.Item
                name="password"
                rules={[
                  {required: true, message: intl.formatMessage({ id: 'member.form.passwordRequired' })},
                  {pattern: registerPasswordReg, message: intl.formatMessage({ id: 'member.form.passwordInvalid' })}
                ]}
                hasFeedback
              >
                <Input.Password
                  className="form-input"
                  type="password"
                  placeholder={intl.formatMessage({ id: 'member.form.passwordInvalid' })}
                />
              </Form.Item>
            </>
            :
            <>
              <label>*<M id="member.form.username" /></label>
              <Form.Item
                name="loginName"
                rules={[
                  {required: true, message: intl.formatMessage({ id: 'member.form.usernameRequired' })},
                  {pattern: j9RegisterReg, message: intl.formatMessage({ id: 'member.form.usernameInvalid' })}
                ]}
                hasFeedback
              >
                <Input
                  className="form-input"
                  placeholder={intl.formatMessage({ id: 'member.form.usernameInvalid' })}
                  allowClear
                />
              </Form.Item>
              <label>*<M id="member.form.password" /></label>
              <Form.Item
                name="password"
                rules={[
                  {required: true, message: intl.formatMessage({ id: 'member.form.passwordRequired' })},
                  {pattern: registerPasswordReg, message: intl.formatMessage({ id: 'member.form.passwordInvalid' })}
                ]}
                hasFeedback
              >
                <Input.Password
                  className="form-input"
                  placeholder={intl.formatMessage({ id: 'member.form.passwordInvalid' })}
                />
              </Form.Item>
              <label>*<M id="member.form.phone" /></label>
              <FormItem.Phone
                name="phone"
                form={form}
                hasFeedback
              />
              <label><M id="member.form.recommendCode" /></label>
              <Form.Item
                name="recommendcode"
              >
                <Input
                  className="form-input"
                  placeholder={intl.formatMessage({ id: 'member.form.recommendCodePlaceholder' })}
                  allowClear
                />
              </Form.Item>
            </>
        }
        {
          captchaType === CAPTCHA_TYPE.IMAGE
            ? <FormItem.ImageVerify name="code" refreshVer={refreshVer} type={"register"}/>
            : captchaType === CAPTCHA_TYPE.TEXT
            ? <FormItem.TextVerify name="code" refreshVer={refreshVer} type={"REGISTER"} form={form}/> : null
        }
        <Form.Item>
          <button className="btn-submit">
            {!loading ? <M id="member.form.doRegister" /> : < LoadingBar/>}
          </button>
        </Form.Item>
      </Form>
      <div className='account-footer'>
        <div
          onClick={() => memberStore.goLogin()}
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({ id: 'member.form.toLogin' })
          }}
        />
      </div>
    </>
  );
};

export default Register;