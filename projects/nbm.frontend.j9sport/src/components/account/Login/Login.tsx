import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { useIntl } from 'react-intl';
import { Form, message, Select } from "antd";
import { CAPTCHA_TYPE, USER_STATUS_CODE } from "../../../consts/statusCode";

import mergeClass from "../../../utils/mergeClass";
import { useApi } from "../../../apis";
import User from "../../../apis/User";
import memberStore from "../../../stores/member";

import M from '../../common/m';

import LoadingBar from "../../common/LoadingBar";
import FormItem from "../common/FormItem/FormItem";

const {CAPTCHA} = USER_STATUS_CODE

// 登录方式
enum LOGIN_TYPE {
  FAST,
  GOOGLE,
  MESSAGE
}

// 手机/用户名登录
enum ACC_TYPE {
  PHONE,
  USERNAME
}

const tabs: Array<{ title: string, type: number }> = [
  {title: 'member.form.quickLogin', type: LOGIN_TYPE.FAST},
  {title: 'member.form.googleLogin', type: LOGIN_TYPE.GOOGLE},
  {title: 'member.form.smsLogin', type: LOGIN_TYPE.MESSAGE}
]

const accTabs: Array<{ title: string, type: number }> = [
  {title: 'member.form.phone', type: ACC_TYPE.PHONE},
  {title: 'member.form.username', type: ACC_TYPE.USERNAME}
]

function Login() {

  const intl = useIntl();
  const [form] = Form.useForm()
  const [user] = useApi([User])
  // 登录类型
  const [loginType, setLoginType] = useState<LOGIN_TYPE>(LOGIN_TYPE.FAST)
  // 账号类型
  const [accType, setAccType] = useState<ACC_TYPE>(ACC_TYPE.USERNAME)

  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState({visible: false, type: 0})
  const [refreshVer, setRefreshVer] = useState(0)

  const closeAccModal = () => {
    memberStore.accountModal = {visible: false}
  }

  const onFinish = async (formData: any) => {
    let loginRes: any = null;
    if (loading) {
      return;
    }
    const params = {...formData,}
    try {
      setLoading(true)
      switch (loginType) {
        // 快速登录
        case LOGIN_TYPE.FAST:
          loginRes = await user.login({...params})
          break;
        case LOGIN_TYPE.GOOGLE:
          loginRes = await user.googleLogin({...params})
          break;
        case LOGIN_TYPE.MESSAGE:
          loginRes = await user.smsLogin({...params})
          break;
      }
      memberStore.login({
        ...loginRes,
        userId: loginRes.nbUserId,
        customerId: loginRes.loginName
      })
      message.success(
        "登录成功",
        .3,
        () => {
          closeAccModal()
        }
      )

    } catch (err) {
      // 验证码相关
      if (err && Object.keys(CAPTCHA).includes(String(err.code))) {
        message.error(err.msg)
        // 图片验证码
        if (err.code === CAPTCHA_TYPE.IMAGE) {
          setCaptcha({
            visible: true,
            type: CAPTCHA_TYPE.IMAGE
          })
        }
        // 文字点击验证码
        if (err.code === CAPTCHA_TYPE.TEXT) {
          setCaptcha({
            visible: true,
            type: CAPTCHA_TYPE.TEXT
          })
        }
      }
    } finally {
      if (captcha.visible) {
        setRefreshVer(refreshVer => refreshVer + 1)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      currency: memberStore.currency
    })
  }, [])

  useEffect(() => {
    form.resetFields(['loginName','password'])
  },[loginType])

  return (
    <>
      {/*登录方式选择*/}
      <div className="account-header">
        {
          tabs.map((item: any) => (
            <div
              key={item.type}
              className={mergeClass({
                active: loginType === item.type
              })}
              onClick={() => setLoginType(item.type)}
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
            >
              <M id={item.title} />
            </div>
          ))
        }
      </div>
      <Form
        form={form}
        name="login"
        className="account-form"
        onFinish={onFinish}
      >
        {/*手机号|游戏账号*/}
        {
          accType === ACC_TYPE.PHONE
            ? <FormItem.Phone form={form}/>
            : <FormItem.Username/>
        }
        <label>
          <M
            id={`member.form.${
              loginType === LOGIN_TYPE.FAST
                ? 'password'
                : (
                  loginType === LOGIN_TYPE.GOOGLE
                  ? 'googleCode'
                  : 'smsCode'
                )
            }`}
          />
          {
          }
        </label>
        {
          loginType === LOGIN_TYPE.FAST
            ? <FormItem.Password/>
            : loginType === LOGIN_TYPE.GOOGLE
            ? <FormItem.Google/>
            : <FormItem.Message type="login" form={form}/>
        }
        {
          captcha.visible
          &&
          captcha.type === CAPTCHA_TYPE.IMAGE
          &&
          <FormItem.ImageVerify
            type="login"
            refreshVer={refreshVer}
          />
        }
        {
          captcha.visible
          &&
          captcha.type === CAPTCHA_TYPE.TEXT
          &&
          <FormItem.TextVerify
            type="LOGIN"
            form={form}
            refreshVer={refreshVer}
          />
        }
        <Form.Item
          name="currency"
          label={intl.formatMessage({ id: 'member.form.currency' })}
          colon={false}
          style={{
            textAlign: 'right',
            margin: 0
          }}
        >
          <Select>
            <Select.Option value={1}>CNY(1:7)</Select.Option>
            <Select.Option value={2}>USDT(1:1)</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <button className="btn-submit">
            {!loading ? <M id="member.form.doLogin" />: < LoadingBar/>}
          </button>
        </Form.Item>
      </Form>
      <div className='account-footer'>
        <span onClick={() => memberStore.goForget()}>
          <M id="member.form.forgotPassword" />
        </span>
        <div
          onClick={() => memberStore.goRegister()}
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({ id: 'member.form.toRegister' })
          }}
        />
      </div>
    </>
  )
}

export default observer(Login);