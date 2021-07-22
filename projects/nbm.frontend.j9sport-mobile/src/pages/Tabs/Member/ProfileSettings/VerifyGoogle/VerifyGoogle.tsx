import React, { useEffect, useState } from 'react';
import copy from "copy-to-clipboard";
import { useHistory } from "react-router";
import { Toast } from "antd-mobile";

import InfoImg from "../../img/info.svg";
import { useApi } from "../../../../../apis";
import User from "../../../../../apis/User";
import NavBar from "../../../../../components/common/NavBar";
import Dialog from "../../../../../components/member/Dialog";
import mergeClass from "../../../../../utils/mergeClass";
import LoadingBar from "../../../../../components/common/LoadingBar";
import IconCaptcha from "../../Wallet/icons/IconCaptcha";
import OnlineCustomerService from "../../../../../components/common/OnlineCustomerService";

type QR_TYPE = {
  /* 二维码图片 */
  qrCodeBase64: string
  /* 二维码图片URL */
  qrCodeUrl: string
  /*秘钥值*/
  secret: string
  /* 秘钥的版本号 */
  version: string
}

function VerifyGoogle() {
  const [user] = useApi([User])
  const history = useHistory()
  const [qrcodeData, setQrcodeData] = useState<QR_TYPE>({} as QR_TYPE)
  const [verifyCode, setVerifyCode] = useState('')
  const [googleBindStatus, setGoogleBindStatus] = useState(false)
  const [verifyVisible, setVerifyVisible] = useState(false)
  const [bindPhone, setBindPhone] = useState<{
    phone: string
    countryCode: string
  }>({
    phone: '',
    countryCode: ''
  })
  const [captcha, setCaptcha] = React.useState<{
    sending: boolean,
    checking: boolean,
    number: string,
    value: string,
    count: number,
    counter?: any
  }>({
    sending: false,
    checking: false,
    number: '',
    value: '',
    count: 0,
    counter: undefined
  });

  const type = googleBindStatus ? 'GOOGLE_CHANGE' : 'GOOGLE_BIND'

  const prefix = bindPhone.phone.substring(0, 3);
  const suffix = (
    Number(bindPhone.phone.length) > 3
      ? bindPhone.phone.substr(-1)
      : ''
  );

  const getQrcode = (type?: string) => {
    user.googleQrCode({type}).then((res: QR_TYPE) => {
      if (res) {
        setQrcodeData(res)
      }
    })
  }

  const handleCheckCaptcha = async () => {
    try {
      Toast.loading('验证中...')
      await await user.googleBind({
        type,
        code: captcha.value,
        version: qrcodeData.version,
      })
      Toast.success('绑定成功')
      setVerifyVisible(false)
      setTimeout(() => {
        history.goBack()
      },1000)
    } finally {
      setCaptcha(old => ({ ...old, checking: false }));
    }
  }

  // 发送短信验证码
  const handleSendSms = async () => {
    if (
      captcha.sending
      ||
      captcha.count > 0
    ) {
      return;
    }
    try {
      setCaptcha(old => ({ ...old, sending: true }));
      const msg = await user.smsSend({
        type,
        phone: `${prefix}${captcha.number}${suffix}`,
        countryCode: bindPhone.countryCode
      });
      Toast.success('验证码发送成功,请注意查收');
      const counter = setInterval(
        () => {
          setCaptcha(old => {
            if (old.count <= 0) {
              clearInterval(captcha.counter);
              return old;
            }
            return ({
              ...old,
              count: old.count - 1
            })
          });
        },
        1000
      );
      setCaptcha(old => ({
        ...old,
        count: 300,
        counter
      }));
    } finally {
      setCaptcha(old => ({ ...old, sending: false }));
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const {googleBindStatus} = await user.googleCheck()
        const bindPhone = await user.getBindPhone()
        setBindPhone({...bindPhone})
        setGoogleBindStatus(googleBindStatus)
        getQrcode(googleBindStatus ? 'GOOGLE_CHANGE' : 'GOOGLE_BIND')
      } catch (e) {
      }
    })()
  }, [])

  useEffect(() => {
    if (verifyCode.length === 6) {
      Toast.loading('验证中...')
      user.googleQRcodeVerify({
        type,
        code: verifyCode,
        version: qrcodeData.version
      }).then(() => {
        Toast.hide()
        setVerifyVisible(true)
      })
    }
  }, [verifyCode])

  return (
    <div className="verify-google">
      <NavBar title={`谷歌验证器${googleBindStatus ? '修改' : '绑定'}`} center/>
      <div className="verify-google-note">
        <img src={InfoImg} alt=""/>
        谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登录等安全验证。
      </div>
      <div className="verify-google-step verify-google-qrcode">
        <p></p>
        <p>第一步：在谷歌验证器中添加密钥并备份</p>
        <img src={"data:image/png;base64," + qrcodeData.qrCodeBase64} alt=""/>
        <p>
          {qrcodeData.secret}
          <span
            onClick={() => {
              copy(qrcodeData.secret, {
                onCopy() {
                  Toast.info('复制成功！')
                }
              })
            }}
          >
            复制
          </span>
        </p>
        <p className="copy-text">秘钥可用于找回谷歌验证器，请勿透露给他人并妥善备份保存</p>
      </div>
      <div className="verify-google-step">
        <p>第二步：输入谷歌验证器中的6位动态码</p>
        <div className="verify-code-input">
          <input
            type="tel"
            maxLength={6}
            placeholder="请输入动态码"
            onChange={(event => setVerifyCode(event.target.value))}
          />
        </div>
      </div>
      <div className="verify-google-step download">
        <p>谷歌验证器下载地址</p>
        <div>
          <a href="https://apps.apple.com/cn/app/google-authenticator/id388497605">iOS版下载</a>
          <a
            href="https://gsf-fl.softonic.com/b63/8f5/c4241c49205d8dcf2fddb12420d70a47b8/com-google-android-apps-authenticator2-5000100-51532195-7f40d893535070cde0ac091d7105bb66.apk?Expires=1617389455&Signature=e112e57d1587e3818c1bafa9199dd3a9f4b56e63&url=https://google-authenticator.softonic.cn/android&Filename=com-google-android-apps-authenticator2-5000100-51532195-7f40d893535070cde0ac091d7105bb66.apk">安卓版下载</a>
        </div>
      </div>
      {/* 验证弹窗(谷歌验证器或短信验证码) */}
      <Dialog
        open={verifyVisible}
        closeButton
        className="wallet-verify-dialog"
        onClose={() => setVerifyVisible(false)}
      >
        <header>身份验证</header>
        <>
          <p>为确保是您本人操作，请在以下输入框完善信息后点击发送验证码</p>
          <div className="input-item phone-number">
            <label>
              {bindPhone.countryCode}
            </label>
            <span>{prefix}</span>
            <span className="input">
                  <input
                    type="text"
                    placeholder="请补充电话号码"
                    maxLength={suffix ? 7 : 8}
                    value={captcha.number}
                    onChange={({target: {value}}) => setCaptcha(old => ({...old, number: value.replace(/\D+/gi, '')}))}
                  />
                </span>
            <span>{suffix}</span>
          </div>
          <div className="input-item captcha">
            <label><IconCaptcha/></label>
            <span className="input">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={captcha.value}
                    onChange={({target: {value}}) => setCaptcha(old => ({...old, value: value.replace(/\D+/gi, '')}))}
                  />
                </span>
            <button
              onClick={handleSendSms}
              className={
                captcha.count === 0
                &&
                !captcha.sending
                &&
                !captcha.checking
                  ? 'available'
                  : undefined
              }
            >
              {
                captcha.sending ? (
                  <LoadingBar/>
                ) : (
                  captcha.count > 0
                    ? `重发${captcha.count}S`
                    : '发送验证码'
                )
              }
            </button>
          </div>
          <button
            className={mergeClass({
              submit: true,
              available: !captcha.checking && captcha.value.length === 6
            })}
            onClick={handleCheckCaptcha}
          >
            {
              captcha.checking
                ? <LoadingBar/>
                : '完成验证'
            }
          </button>
        </>
        )
        <OnlineCustomerService/>
      </Dialog>
    </div>
  );
}

export default VerifyGoogle;