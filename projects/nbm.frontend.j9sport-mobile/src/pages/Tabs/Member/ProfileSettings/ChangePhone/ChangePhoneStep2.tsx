import React, { useState } from 'react';
import { Toast } from "antd-mobile";
import { phoneNumberReg } from "../../../../../consts/regexr";
import { useApi } from "../../../../../apis";
import mergeClass from "../../../../../utils/mergeClass";
import User from "../../../../../apis/User";

import verifyImg from "../../img/phone-verify.png";
import Countdown from "../../../../../components/common/Countdown";
import CountryCode from "../../../../../components/CountryCode";

function ChangePhoneStep2(
  {
    nextStep
  }: {
    nextStep: Function
  }
) {
  const [user] = useApi([User])
  const [countryCode, setCountryCode] = useState("+86")
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSendStatus, setCodeSendStatus] = useState(true)
  const [count, setCount] = useState(0)

  const handleCodeSend = () => {
    if (phone === '') {
      Toast.info('请填写新的手机号码')
      return;
    }
    if (countryCode === "+86" && !phoneNumberReg.test(phone)) {
      Toast.info('手机号格式错误')
      return;
    }
    Toast.loading('发送中...')
    user.smsSend(
      {
        type: 'change_phone_new',
        countryCode,
        phone,
      }
    ).then((res: any) => {
      if (res) {
        Toast.success('发送成功')
        setCount(300)
        setCodeSendStatus(false)
      }
    })
  }

  const handleNextStep = () => {
    Toast.loading('验证中...')
    user.updatePhone({
      countryCode,
      phone,
      code,
    }).then((res: any) => {
      Toast.hide()
      if (res) {
        nextStep()
      }
    })
  }

  return (
    <div className="profile-container">
      {/*填写手机号码*/}
      <div className="profile-container-input phone-number">
        {
          !!countryCode
          &&
          <CountryCode
            className="rightline"
            initialCode={countryCode}
            onSelected={(countryCode: string) => {setCountryCode(countryCode)}}
          />
        }
        <div className="phone-number-input complete">
          <input
            type="tel"
            value={phone}
            onChange={event => setPhone(event.target.value)}
            placeholder="请填写新的手机号码"
          />
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
            onChange={event => setCode(event.target.value.replace(' ',''))}
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
        onClick={handleNextStep}
        className={
          mergeClass({
            "next-step": true,
            "next-step-active": code !== '' && phone !== ''
          })
        }
      >
        下一步
      </button>
    </div>
  );
}

export default ChangePhoneStep2;