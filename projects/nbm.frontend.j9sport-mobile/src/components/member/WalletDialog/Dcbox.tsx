import { Toast } from 'antd-mobile';
import copy from "copy-to-clipboard";
import React from 'react';
import { useIntl } from 'react-intl';
import { useApi } from '../../../apis';
import User from '../../../apis/User';
import Wallet, { Currency } from '../../../apis/Wallet';
import IconCaptcha from '../../../pages/Tabs/Member/Wallet/icons/IconCaptcha';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../common/LoadingBar';
import CountryCode from '../../CountryCode';
import IconSuccess from '../Dialog/icons/IconSuccess';
import AccountName from './AccountName';

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
      Toast.info('验证码已发送成功');
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
          Toast.fail('请填正确的手机号码');
          return;
        }
        if (captcha.value.length !== 6) {
          Toast.fail('请填写6位验证码');
          return;
        }

        await user.smsVerify({
          countryCode: captcha.countryCode,
          phone,
          type: 'DCBOX',
          code: captcha.value
        })
      } else if (currentAccount) {
        setDcboxAccount(currentAccount);
        return;
      }

      // 创建小金库账号
      const account = await wallet.dcboxRegister(
        !useBinded ? {
          countryCode: captcha.countryCode,
          phone
        }: {}
      )

      setDcboxAccount(account);
    } finally {
      setCreating(false);
    }
  };


  const handleCopy = (content: string) => {
    if (copy(content)) {
      Toast.success(intl.formatMessage({id: 'ticket.copy_success'}))
    } else {
      Toast.fail(intl.formatMessage({id: 'ticket.copy_failed'}))
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
          className="submit available"
          onClick={() => onFinished(dcboxAccount)
        }>我知道了</button>
      </div>
    );
  }

  return (
    <>
      <header>注册小金库</header>
      <p>使用游戏账号绑定手机号注册</p>
      <div className="number-mode">
        {
          ynItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setUseBinded(item.value)}
              className={item.value === useBinded ? 'selected' : undefined}
            >
              {item.label}
            </button>
          ))
        }
      </div>
      {
        !useBinded ? (
          <>
          <div className="input-field phone-number">
            {/* <label>+86</label> */}
            <label>
              {/* <CountryCode onSelected={onSelected}/> */}
              <CountryCode
                initialCode={captcha.countryCode}
                onSelected={(countryCode: string) => setCaptcha({
                  ...captcha,
                  countryCode
                })}
                classes={{
                  drawer: 'dcbox-country-code-drawer'
                }}
              />
            </label>
            <span>
              <input
                type="text"
                value={phone}
                onChange={({ target: { value } }) => setPhone(value)}
                placeholder="请输入您的手机号码"
              />
            </span>
          </div>
          <div className="input-field captcha">
            <label><IconCaptcha /></label>
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
                  <LoadingBar />
                ) : (
                  captcha.count > 0
                  ? `重发${captcha.count}S`
                  : '发送验证码'
                )
              }
            </button>
          </div>
          </>
        ) : null
      }
      <button
        className="submit available"
        onClick={handleSubmit}
      >完成注册</button>
      <div className="remark">
        <a
          href="https://dcbox.com/download"
          target="_blank"
        ><b>下载小金库APP</b></a>
      </div>
    </>
  );
}

function Dcbox(
  {
    virtualWalletInfo,
    accountName = '',
    onFinish
  } : {
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
        readonly={Boolean(accountName)}
        onChange={value => setWalletInfo(ov => ({ ...ov, accountName: value }))}
      />
      <div className="input-field">
        <label>钱包类型</label>
        <span>{virtualWalletInfo[0].walletName}</span>
      </div>
      <div className="input-field">
        <label>钱包协议<button>?</button></label>
        <span>{virtualWalletInfo[0].protocolList[0].protocol}</span>
      </div>
      <div className="input-field">
        <label>金库号</label>
        <span>
          <input
            type="text"
            maxLength={12}
            value={walletInfo.accountNo}
            onChange={
              ({ target: { value } }) => setWalletInfo(wi => ({ ...wi, accountNo: value.replace(/\W/gi, '')}))
            }
          />
        </span>
      </div>
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
      <div className="remark">
        <a onClick={() => setRegisting(true)}>没有小金库钱包? <b>立即注册</b></a>
      </div>
    </>
  );
}

export default Dcbox;
