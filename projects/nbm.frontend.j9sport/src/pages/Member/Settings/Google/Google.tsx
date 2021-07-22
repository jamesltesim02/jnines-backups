import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, message } from "antd";
import { CustomerServiceOutlined } from '@ant-design/icons';
import copy from "copy-to-clipboard";
import Back from "../Back";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";

import ImageInfo from '../img/info-gray.svg';
import LoadingBar from "../../../../components/common/LoadingBar";
import Dialog from "../../../../components/member/Dialog";
import FormItem from "../../../../components/account/common/FormItem/FormItem";
import IconAndroid from "../Icons/IconAndroid";
import IconIos from "../Icons/IconIos";

function Google() {
  const [form] = Form.useForm()
  const [formPhone] = Form.useForm()
  const [user] = useApi([User])
  const history = useHistory()
  const [bindPhone, setBindPhone] = useState({
    countryCode: '',
    phone: '',
    verifyStatus: false,
  })
  const [verifyPhoneVisible, setVerifyPhoneVisible] = useState(false)
  const [googleBindStatus, setGoogleBindStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleQrcode, setGoogleQrcode] = useState({
    qrCodeBase64: '',
    secret: '',
    version: ''
  })
  const GOOGLE_BIND_TYPE = googleBindStatus ? 'GOOGLE_CHANGE' : 'GOOGLE_BIND'

  const onFinish = async (formData: any) => {
    if (!googleQrcode.version) {
      message.warn('二维码未加载,请刷新页面重试')
      return;
    }

    try {
      setLoading(true)
      await user.googleQRcodeVerify({
        ...formData,
        version: googleQrcode.version,
        type: GOOGLE_BIND_TYPE
      })
      setVerifyPhoneVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    copy(googleQrcode.secret)
    &&
    message.success('复制成功')
  }

  const handlePhone = async (formData: any) => {
    try {
      await user.googleBind({
        ...formData,
        version: googleQrcode.version,
        type: GOOGLE_BIND_TYPE
      })
      message.success(
        '绑定成功!',
        .5,
        () => {
          history.goBack()
        }
      )
    } finally {
      setVerifyPhoneVisible(false)
    }
  }

  useEffect(() => {
    (async function () {
      try {
        const {googleBindStatus} = await user.googleCheck()
        const bindPhone = await user.getBindPhone()
        setBindPhone({...bindPhone})
        setGoogleBindStatus(googleBindStatus)
        formPhone.setFieldsValue({
          countryCode: bindPhone.countryCode
        })
        const res = await user.googleQrCode({type: googleBindStatus ? 'GOOGLE_CHANGE' : 'GOOGLE_BIND'})
        setGoogleQrcode({...res})
      } catch (e) {
      }
    })()
  }, [])

  return (
    <div className="google">
      <Back title={googleBindStatus ? "修改谷歌验证器" : "绑定谷歌验证器"}/>
      <div className="google-info">
        <img src={ImageInfo} alt=""/>
        <p>谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登 录等安全验证</p>
      </div>
      <section className="google-step">
        <header>
          <span>1</span>
          <p>下载谷歌验证器</p>
        </header>
        <div className="info">iOS用户登录App Store 搜索“Authenticator"下载。安卓用户使用提供的“安卓版本下载”专属链接下载</div>
        <div className="download">
          <a>
            <IconIos />
            iOS版本下载
          </a>
          <a>
            <IconAndroid />
            安卓版本下载
          </a>
        </div>
      </section>
      <section className="google-step">
        <header>
          <span>2</span>
          <p>在谷歌验证器中添加密钥并备份</p>
        </header>
        <div className="info">打开谷歌验证器，扫描下方二维码或手动输入下述秘钥添加验证令牌</div>
        <div className="google-qrcode">
          <div className="qrcode">
            <img src={"data:image/png;base64," + googleQrcode.qrCodeBase64} alt=""/>
          </div>
          <div>
            <div className="copy">
              <span>{googleQrcode.secret}</span>
              <button onClick={handleCopy}>复制</button>
            </div>
            <p className="copy-info">
              秘钥可用于找回谷歌验证器，请勿透露给他人并妥善备份保存
            </p>
          </div>
        </div>
      </section>
      <section className="google-step">
        <header>
          <span>3</span>
          <p>输入谷歌验证器中6位数验证码</p>
        </header>
        <Form
          name="google"
          form={form}
          onFinish={onFinish}
          onValuesChange={(changedFields) => {}}
        >
          <Form.Item
            name="code"
            rules={[
              {required: true, message: '谷歌验证码不能为空'},
              {pattern: /^\d{6}$/, message: '谷歌验证码为6位数字母'}
            ]}
          >
            <Input
              className="google-input"
              placeholder="6位数谷歌验证码"
              type="number"
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <button className="btn-submit">
              {!loading ? "提交" : <LoadingBar />}
            </button>
          </Form.Item>
        </Form>
      </section>
      <Dialog
        open={verifyPhoneVisible}
        closeButton
        imgbg
        className="modify-phone-dialog"
        onClose={() => setVerifyPhoneVisible(false)}
        destroyOnClose={true}
      >
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
              form={formPhone}
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
                  addonBefore={<div>{`${bindPhone.countryCode} ${bindPhone.phone.substring(0, 3)}`}</div>}
                  placeholder="请补充手机号码"
                  allowClear
                />
              </Form.Item>
              <label>* 验证码</label>
              <FormItem.Message
                form={formPhone}
                phoneName="phone"
                prefixPhone={bindPhone.phone.substring(0, 3)}
                type={GOOGLE_BIND_TYPE}
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
                  {!loading ? '绑定' : <LoadingBar />}
                </button>
              </Form.Item>
            </Form>
            <div className="contact-customer">
              <CustomerServiceOutlined />
              遇到问题了吗? 联系
              <a>在线客服</a>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Google;