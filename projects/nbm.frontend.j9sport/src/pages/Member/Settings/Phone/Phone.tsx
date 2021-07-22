import React, { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import FormItem from "../../../../components/account/common/FormItem/FormItem";
import * as reg from "../../../../consts/regexr";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";
import LoadingBar from "../../../../components/common/LoadingBar";
import OnlineCustomerService from '../../../../components/common/OnlineCustomerService';

enum VERIFY_TYPE {
  PHONE,
  GOOGLE
}

function Phone(
  {
    bindPhone,
    close
  }: {
    bindPhone: {
      countryCode: string,
      phone: string,
      verifyStatus: boolean,
    },
    close: Function
  }
) {
  const [form] = Form.useForm()
  const [form2] = Form.useForm()
  const [formGoogle] = Form.useForm()
  const [user] = useApi([User])
  const [step, setStep] = useState(0)
  const [verifyType, setVerifyType] = useState(VERIFY_TYPE.PHONE)
  const [loading, setLoading] = useState(false)
  const {countryCode} = bindPhone
  const prefixPhone = bindPhone.phone.substring(0, 3)
  const phoneReg = countryCode === '+86' ? reg.phoneNumberReg : reg.numberReg

  useEffect(() => {
    form.setFieldsValue({
      countryCode
    })
  }, [])

  const handlePhone = async (formData: any) => {
    try {
      setLoading(true)
      await user.smsVerify({
        ...formData,
        phone: prefixPhone + formData.phone,
        type: 'change_phone_old'
      })
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const handleBindPhone = async (formData: any) => {
    try {
      setLoading(true)
      await user.updatePhone({
        ...formData,
      })
      message.success(
        "绑定成功",
        .5,
        () => {
          close()
        }
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async (formData: any) => {
    try {
      setLoading(true)
      await user.googleVerify(
        {
          type: 'CHANGE_PHONE_OLD',
          code: formData.authCode
        }
      )
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  if (verifyType === VERIFY_TYPE.GOOGLE) {
    return (
      <div className="phone-container">
        <div className="tit">谷歌验证</div>
        <div className="info">
          为确保是您本人操作，
          <br/>
          使用谷歌验证器完成身份验证。
        </div>
        <Form
          form={formGoogle}
          name={'google'}
          onFinish={handleGoogle}
        >
          <label>* 谷歌验证码</label>
          <FormItem.Google />
          <Form.Item>
            <button className="btn-submit">
              {!loading ? '下一步' : <LoadingBar/>}
            </button>
          </Form.Item>
          <div className="type">
            使用
            <span onClick={() => setVerifyType(VERIFY_TYPE.PHONE)}>短信验证</span>
          </div>
        </Form>
        <OnlineCustomerService className="contact-customer">
          <CustomerServiceOutlined/>
          遇到问题了吗? 联系
          <b>在线客服</b>
        </OnlineCustomerService>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="phone-container">
        <div className="tit">修改手机</div>
        <Form
          name='newPhone'
          form={form2}
          onFinish={handleBindPhone}
        >
          <label>* 新手机号码</label>
          <FormItem.Phone form={form2} name="phone"/>
          <label>* 验证码</label>
          <FormItem.Message
            form={form2}
            phoneName="phone"
            type="change_phone_new"
          />
          <Form.Item>
            <button className="btn-submit">
              {!loading ? '提交' : <LoadingBar/>}
            </button>
          </Form.Item>
        </Form>
        <OnlineCustomerService className="contact-customer">
          <CustomerServiceOutlined/>
          遇到问题了吗? 联系
          <b>在线客服</b>
        </OnlineCustomerService>
      </div>
    )
  }

  return (
    <div>
      <div className="phone-container">
        <div className="tit">身份验证</div>
        <div className="info">
          为确保是您本人操作，
          <br/>
          请在以下输入框完善信息后点击发送验证码。
        </div>
        <Form
          name='phone'
          form={form}
          onFinish={handlePhone}
        >
          <label>* 手机号码</label>
          <Form.Item
            name="phone"
            rules={
              [{required: true, message: '手机号码不能为空'}]
            }
          >
            <Input
              className="form-input add"
              addonBefore={<div>{`${bindPhone.countryCode} ${prefixPhone}`}</div>}
              placeholder="请补充手机号码"
              allowClear
            />
          </Form.Item>
          <label>* 验证码</label>
          <FormItem.Message
            form={form}
            phoneName="phone"
            prefixPhone={prefixPhone}
            type="CHANGE_PHONE_OLD"
          />
          <Form.Item
            name="countryCode"
            shouldUpdate
            hidden
          >
            <Input/>
          </Form.Item>
          <Form.Item>
            <button className="btn-submit">
              {!loading ? '下一步' : <LoadingBar/>}
            </button>
          </Form.Item>
          <div className="type">
            使用
            <span onClick={() => setVerifyType(VERIFY_TYPE.GOOGLE)}>谷歌验证</span>
          </div>
        </Form>
        <OnlineCustomerService className="contact-customer">
          <CustomerServiceOutlined/>
          遇到问题了吗? 联系
          <b>在线客服</b>
        </OnlineCustomerService>
      </div>
    </div>
  );
}

export default Phone;