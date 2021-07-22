import { message } from "antd";
import copy from "copy-to-clipboard";
import React from 'react';
import { useIntl } from 'react-intl';
import { useApi } from '../../../apis';
import User from '../../../apis/User';
import Wallet from '../../../apis/Wallet';
import mergeClass from '../../../utils/mergeClass';
import CountryCode from "../../common/CountryCode";
import LoadingBar from '../../common/LoadingBar';
import IconSuccess from '../Dialog/icons/IconSuccess';
import AccountName from './AccountName';

import DcboxQrcodeImage from './images/dcbox-qrcode@2x.jpg';

const ynItems = [
  {
    value: true,
    label: '是'
  },
  {
    value: false,
    label: '否'
  }
];

// 注册小金库账号
function DcboxRegister (
  {
    wallet,
    currentAccount,
    onFinished
  }: {
    wallet: Wallet,
    currentAccount?: string,
    onFinished: (dcboxAccount: string) => void
  }
) {
  const intl = useIntl();
  const { user } : { user: User } = useApi({ user: User });

  const [useBinded, setUseBinded] = React.useState(ynItems[0].value);
  const [phone, setPhone] = React.useState('');
  const [captcha, setCaptcha] = React.useState<{
    sending: boolean,
    checking: boolean,
    value: string,
    count: number,
    counter?: any
    countryCode: string,
  }>({
    sending: false,
    checking: false,
    value: '',
    count: 0,
    counter: undefined,
    countryCode: '+86'
  });
  const [creating, setCreating] = React.useState(false);
  const [dcboxAccount, setDcboxAccount] = React.useState<string|undefined>();

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
        phone,
        type: 'DCBOX',
        countryCode: captcha.countryCode
      });
      message.info('验证码已发送成功');
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

  // 提交注册
  const handleSubmit = async () => {
    try {
      setCreating(true);
      // 如果是另外的手机号码,则需要输入短信验证码
      if (!useBinded) {
        if (!phone || !/^1\d{10}$/.test(phone)) {
          message.error('请填正确的手机号码');
          return;
        }
        if (captcha.value.length !== 6) {
          message.error('请填写6位验证码');
          return;
        }

        await user.smsVerify({
          countryCode: captcha.countryCode,
          phone,
          type: 'DCBOX',
          code: captcha.value
        });
      } else if (currentAccount) {
        setDcboxAccount(currentAccount);
        return;
      }

      // 创建小金库账号
      const account = await wallet.dcboxRegister(
        !useBinded ? {
          countryCode: captcha.countryCode,
          phone
        } : {},
      );

      setDcboxAccount(account);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (content: string) => {
    if (copy(content)) {
      message.success(`复制成功: ${content}`);
    } else {
      message.warn('复制失败');
    }
  }

  if (dcboxAccount) {
    return (
      <div className="dcreg-success">
        <IconSuccess />
        <h3 className="main-message">注册成功</h3>
        <section>
          您的小金库账号为:
          <b>{dcboxAccount}</b>
          <button
            className="copy"
            onClick={() => handleCopy(dcboxAccount)}
          >复制</button>
        </section>
        <p>请使用小金库账号绑定钱包吧~</p>
        <button
          className="submit full-single-submit available"
          onClick={() => onFinished(dcboxAccount)
        }>我知道了</button>
      </div>
    );
  }

  return (
    <>
      <header>注册小金库</header>
      <div className="input-field">
        <label>使用游戏账号绑定手机号注册</label>
        <div className="number-mode">
          {
            ynItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setUseBinded(item.value)}
                className={item.value === useBinded ? 'selected' : undefined}
              >
                <i />
                {item.label}
              </button>
            ))
          }
        </div>
      </div>
      {
        !useBinded ? (
          <>
          <div className="input-field dcbox-phone-number">
            <label>其他手机号</label>
            <div>
              {/* <span>+86</span> */}
              <CountryCode
                initialCode={captcha.countryCode}
                onSelected={(countryCode: string) => setCaptcha({
                  ...captcha,
                  countryCode
                })}
              />
              <span className="input">
                <input
                  type="text"
                  value={phone}
                  onChange={({ target: { value } }) => setPhone(value)}
                  placeholder="请输入您的手机号码"
                />
              </span>
            </div>
          </div>
          <div className="input-field captcha">
            <label>验证码</label>
            <div>
              <span className="input">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={captcha.value}
                  maxLength={6}
                  onChange={({ target: { value } }) => setCaptcha(old => ({ ...old, value: value.replace(/\D+/gi, '') }))}
                />
              </span>
              <button
                onClick={handleSendSms}
                className={mergeClass(
                  'submit',
                  (
                    captcha.count === 0
                    &&
                    !captcha.sending
                    &&
                    !captcha.checking
                    ? 'available'
                    : undefined
                  )
                )}
              >
                {
                  captcha.sending ? (
                    <LoadingBar />
                  ) : (
                    captcha.count > 0
                    ? `重发${captcha.count}S`
                    : '发送验证码'
                  )
                }
              </button>
            </div>
          </div>
          </>
        ) : null
      }
      <button
        className="submit full-single-submit available"
        onClick={handleSubmit}
      >完成注册</button>
      <div className="dcbox-qrcode">
        <a
          href="https://dcbox.com/download"
          target="_blank"
        >
          <img src={DcboxQrcodeImage} />
        </a>
      </div>
    </>
  );
}

function Dcbox(
  {
    open = false,
    virtualWalletInfo,
    accountName = '',
    onFinish
  } : {
    open: boolean,
    virtualWalletInfo: any,
    accountName: string,
    onFinish: () => void
  }
) {
  // 钱包api
  const { wallet } : { wallet: Wallet } = useApi({ wallet: Wallet });

  const [walletInfo, setWalletInfo] = React.useState({
    currency: 'USDT_DCBOX',
    accountName,
    walletType: 'DCBOX',
    protocol: virtualWalletInfo[0].protocolList[0].protocol,
    accountNo: virtualWalletInfo[0].virtualAccount
  });
  const [adding, setAdding] = React.useState(false);
  const [registing, setRegisting] = React.useState(false);

  const handleSubmit = async () => {
    if (
      adding
      ||
      walletInfo.accountNo.length < 8
      ||
      !walletInfo.accountName
    ) {
      return;
    }

    try {
      setAdding(true);
      await wallet.addVirtual(walletInfo);
      onFinish();
    } finally {
      setAdding(false);
    }
  };

  React.useEffect(
    () => {
      setAdding(false);
      setRegisting(false);
    },
    [open]
  );

  if (registing) {
    return (
      <DcboxRegister
        wallet={wallet}
        currentAccount={walletInfo.accountNo}
        onFinished={(dcboxAccount: string) => {
          setRegisting(false);
          setWalletInfo(wi => ({ ...wi, accountNo: dcboxAccount }));
        }}
      />
    );
  }

  return (
    <>
      <header>添加小金库钱包</header>
      <AccountName
        value={walletInfo.accountName}
        readOnly={Boolean(accountName)}
        onChange={value => setWalletInfo(ov => ({ ...ov, accountName: value }))}
      />
      <div className="input-field">
        <label>
          <b>*</b>钱包类型
          <span><a onClick={() => setRegisting(true)}>没有小金库钱包? <b>立即注册</b></a></span>
        </label>
        <div>{virtualWalletInfo[0].walletName}</div>
      </div>
      <div className="input-field">
        <label><b>*</b>钱包协议<button>?</button></label>
        <div>{virtualWalletInfo[0].protocolList[0].protocol}</div>
      </div>
      <div className="input-field">
        <label><b>*</b>金库号</label>
        <div>
          <input
            type="text"
            maxLength={12}
            value={walletInfo.accountNo}
            onChange={
              ({ target: { value } }) => setWalletInfo(wi => ({ ...wi, accountNo: value.replace(/\W/gi, '')}))
            }
          />
        </div>
      </div>
      <div className="buttons">
        <button
          className="cancel"
          // onClick={onClose}
        >取消</button>
        <button
          className={mergeClass({
            submit: true,
            available: (
              !adding
              &&
              walletInfo.accountNo.length >= 8
              &&
              walletInfo.accountName
            )
          })}
          onClick={handleSubmit}
        >
        {
          adding
          ? <LoadingBar />
          : '完成验证'
        }
        </button>
      </div>
    </>
  );
}

export default Dcbox;
