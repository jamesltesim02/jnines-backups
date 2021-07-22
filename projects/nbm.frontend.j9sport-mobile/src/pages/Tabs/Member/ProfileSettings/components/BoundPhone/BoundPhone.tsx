import React, { useEffect, useState } from 'react';
import { Toast } from "antd-mobile";
import { useApi } from "../../../../../../apis";
import User from "../../../../../../apis/User";

import { phoneNumberReg } from "../../../../../../consts/regexr";
import verifyImg from "../../../img/phone-verify.png";
import Countdown from "../../../../../../components/common/Countdown";
import CountryCode from "../../../../../../components/CountryCode";

function BoundPhone(
  {
    type,
    onSubmit
  }: {
    type: 'change_phone_old' | 'bound' | "CHANGE_PHONE_OLD"
    onSubmit: Function
  }
) {
  const [user] = useApi([User])
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSendStatus, setCodeSendStatus] = useState(true)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleCodeSend = async () => {
    const completePhone = prefix + phone + suffix
    if (phone === '') {
      Toast.info('请先补充手机号码')
      return;
    }
    if (countryCode === "+86" && !phoneNumberReg.test(completePhone)) {
      Toast.info('手机号格式错误')
      return;
    }
    Toast.loading('发送中...')

    try {
      setLoading(true)
      // 检验手机号
      const isPhoneRight = await user.changePhoneVerify(
        {
          countryCode,
          phone: completePhone
        }
      )
      if (isPhoneRight) {
        Toast.info('手机号码输入错误')
        return;
      }
      // 检验手机号码没问题  发送手机验证码
      const msg = await user.smsSend({
        countryCode,
        phone: completePhone,
        type
      })
      if (msg) {
        Toast.success(msg)
        setCount(300)
        setCodeSendStatus(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const onVerify = () => {
    if (loading) {
      return;
    }
    if (code ==='') {
      Toast.info('验证码不能为空')
      return;
    }
    const completePhone = prefix + phone + suffix
    onSubmit({
      countryCode,
      phone: completePhone,
      code
    })
  }

  useEffect(() => {
    user.getBindPhone().then((res: any) => {
      setPrefix(res.phone.slice(0, 3))
      setSuffix(res.phone.slice(-1))
      setCountryCode(res.countryCode)
    })
  }, [])

  return (
    <>
      {/*填写手机号码*/}
      <div className="profile-container-input phone-number">
        {
          !!countryCode
          &&
          <CountryCode initialCode={countryCode} className="rightline" onSelected={(code: string) => {
            setCountryCode(code)
          }}/>
        }
        <div className="phone-number-input">
          <div>{prefix}</div>
          <input
            type="tel"
            maxLength={countryCode === '+86' ? 7 : 10}
            value={phone}
            onChange={event => setPhone(event.target.value)}
            placeholder="请补充手机号码"
          />
          <div>{suffix}</div>
        </div>
      </div>
      {/*发送验证码*/}
      <div className="profile-container-input phone-verify">
        <div className="rightline">
          <img src={verifyImg} alt=""/>
        </div>
        <div className="phone-verify-input">
          <input
            value={code}
            onChange={event => setCode(event.target.value.replace(' ', ''))}
            type="tel"
            placeholder="请输入验证码"
            maxLength={8}
          />
        </div>
        {
          codeSendStatus ?
            <button
              className="send-btn"
              onClick={handleCodeSend}
            >
              发送验证码
            </button> :
            <button className="send-btn inactive">
              重发
              (<Countdown onCountdown={() => setCodeSendStatus(true)} count={count} />s)
            </button>
        }
      </div>
      <button
        onClick={onVerify}
        className="next-step next-step-active"
      >
        下一步
      </button>
    </>
  );
}

export default BoundPhone;