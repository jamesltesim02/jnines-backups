import React from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { useApi } from '../../../apis';
import User from '../../../apis/User';
import Wallet, { BankCard, VirtualWallet, VerifyInfo, Currency } from '../../../apis/Wallet';
import MemberLayout from '../../../components/member/MemberLayout';
import IconAdd from './icons/IconAdd';
import IconDcbox from './icons/IconDcbox';
import IconIC from './icons/IconIC';
import IconTrash from './icons/IconTrash';
import IconUsdt from './icons/IconUsdt';
import IconWifi from './icons/IconWifi';
import Dialog from '../../../components/member/Dialog';
import WalletDialog from '../../../components/member/WalletDialog';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../../components/common/LoadingBar';
import OnlineCustomerService from '../../../components/common/OnlineCustomerService';

type Wallets = {
  accountName?: string,
  dcbox?: VirtualWallet,
  dcboxAllowed: boolean,
  dcboxAvailable: boolean,
  usdt: Array<VirtualWallet>,
  usdtAllowed: boolean,
  usdtAvailable: boolean,
  bankcard: Array<BankCard>,
  bankcardAllowed: boolean,
};

function getWalletName (walletType: string, bankName: string, currency: string) {
  if (
    `${walletType}${bankName}`.toLowerCase().indexOf('huobi') > -1
  ) {
    return '火币钱包';
  }
  if (currency === 'USDT_BFB') {
    return '币付宝（USDT）';
  }

  return 'USDT';
}

function WalletPage () {

  const { wallet, user }: { wallet: Wallet, user: User } = useApi({ wallet: Wallet, user: User });
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);

  const [wallets, setWallets] = React.useState<Wallets>({
    dcbox: undefined,
    dcboxAllowed: false,
    dcboxAvailable: false,
    usdt: [],
    usdtAllowed: false,
    usdtAvailable: false,
    bankcard: [],
    bankcardAllowed: false,
  });

  const [verify, setVerify] = React.useState<{
    verifying: boolean,
    type?: string,
    currency?: string,
    verifyInfo?: VerifyInfo,
    googleMode?: boolean,
  }>({ verifying: false });

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

  const prefix = verify.verifyInfo?.phone.substring(0, 3);
  const suffix = (
    Number(verify.verifyInfo?.phone.length) > 3
    ? verify.verifyInfo?.phone.substr(-1)
    : ''
  );

  // 查询钱包列表的callback
  const queryWallet = React.useCallback(
    () => {
      setLoading(true);
      // 查询当前的绑定信息
      wallet.list().then(result => {
      // 钱包信息
      const wallets: Wallets = {
        // 姓名
        accountName: result.accountName,
        // 小金库
        dcbox: result.virtual.find(w => w.walletType === Currency.DCBOX),
        dcboxAllowed: result.dcBoxBindSwitch,
        dcboxAvailable: result.dcBoxSwitch,
        // 普通USDT钱包
        usdt: result.virtual.filter(w => w.walletType !== Currency.DCBOX) as any || [],
        usdtAllowed: result.usdtBindSwitch,
        usdtAvailable: result.usdtSwitch,
        // 普通银行卡
        bankcard: result.banks || [],
        bankcardAllowed: result.cnyWithdrawFlag
      }
      if (
        wallets.usdtAllowed
        &&
        (
          (
            wallets.dcboxAllowed
            &&
            wallets.usdt.length < 2
          )
          ||
          wallets.usdt.length  < 3
        )
      ) {
        wallets.usdt.push(
          ...new Array(
            (wallets.dcboxAllowed ? 2 : 3)
            -
            wallets.usdt.length
          ).fill(undefined)
        )
      }
      if (
        wallets.bankcardAllowed
        &&
        wallets.bankcard.length < 3
      ) {
        wallets.bankcard.push(
          ...new Array(3 - wallets.bankcard.length).fill(undefined)
        )
      }
      setWallets(wallets);
      }).finally(
        () => setLoading(false)
      )
    },
    [wallet, setLoading]
  );

  // 添加钱包
  const addWallet = async (currency: string) => {
    const hide = message.loading('正在处理,请稍后...');
    try {
      const verifyInfo = await wallet.verifyInfo();
      // verifyInfo.isVerified = true;
      // verifyInfo.googleBindStatus = true;
      setVerify(v => ({
        ...v,
        currency,
        verifyInfo,
        // googleMode: true,
        googleMode: verifyInfo.googleBindStatus,
        verifying: !verifyInfo?.isVerified,
      }));
      setCaptcha(old => ({ ...old, value: '' }));
      if (verifyInfo?.isVerified) {
        handleAddWallets();
      }
    } finally {
      hide();
    }
  };

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
        phone: `${prefix}${captcha.number}${suffix}`,
        type: 'bank',
        countryCode: verify.verifyInfo?.countryCode as string
      });
      message.info('验证码发送成功,请注意查收');
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

  // 校验短信验证码
  const handleCheckCaptcha = async () => {
    if (
      captcha.checking
      ||
      captcha.checking
      ||
      captcha.value.length < 6
    ) {
      return;
    }
    try {
      setCaptcha(old => ({ ...old, checking: true }));
      // 校验验证码
      const result = await user.smsVerify({
        countryCode: verify.verifyInfo?.countryCode as string,
        phone: `${prefix}${captcha.number}${suffix}`,
        type: 'bank',
        code: captcha.value
      });
      // 打开添加界面
      await handleAddWallets();
    } finally {
      setCaptcha(old => ({ ...old, checking: false }));
    }
  };

  // 校验谷歌验证码
  const handleGoogleCheck = async () => {
    if (
      captcha.checking
      ||
      captcha.value.length !== 6
    ) {
      return;
    }
    try {
      setCaptcha(old => ({ ...old, checking: true }));
      // 校验验证码
      const result = await user.googleVerify({
        type: 'bank',
        code: captcha.value
      });
      // 打开添加界面
      handleAddWallets();
    } finally {
      setCaptcha(old => ({ ...old, checking: false }));
    }
  };

  // 弹出添加窗口
  const handleAddWallets = async () => {
    setVerify(v => ({ ...v, verifying: false }))
    setAdding(true);
  };

  // 添加完成事件
  const handleFinish = async () => {
    // 提示成功
    message.success('添加成功!');
    // 关闭弹窗
    setAdding(false);
    // 重新查询
    queryWallet();
  };

  // 删除事件
  const handleDelete = async (id: string, currency: string) => {
    const hide = message.loading('删除中,请稍后...', 0);
    try {
      await wallet.deleteWallet({ id, currency });
      // 提示成功
      message.success('删除成功!');
      // 重新查询
      queryWallet();
    } finally {
      hide();
    }
  };

  React.useEffect(
    () => {
      queryWallet();
    },
    [wallet]
  );

  if (loading) {
    return <LoadingBar />
  }

  return (
    <MemberLayout
      title="我的钱包"
      subTitle="MY WALLET"
      className="wallet-page"
    >
      <div className="tips">温馨提示：当前支持添加小金库钱包（USDT） . USDT钱包 . 借记卡，若您需要修改收款信息 ， 请先删除该资料后重新添加即可。</div>
      <div className="wallet-list">
        {/* 小金库 */}
        {
          wallets.dcboxAllowed ? (
            wallets.dcbox ? (
              <div className="wallet-item wallet-dcbox" >
                <header>小金库</header>
                <div className="number-decoration">
                    <IconIC />
                    <IconWifi />
                    <span>··········</span>
                  </div>
                  <div className="number">·····{wallets.dcbox.cardNo.replace(/\*/gi, '')}</div>
                <section>{wallets.dcbox.name}</section>
                <p>{wallets.dcbox.walletProtocol}</p>
                {
                  (
                    wallets.usdt.filter(Boolean).length
                    +
                    (wallets.dcbox ? 1 : 0)
                  ) > 1 ? (
                    <button
                      onClick={() => Modal.confirm({
                        icon: <ExclamationCircleOutlined />,
                        title: '删除小金库钱包',
                        content: '你确定要删除小金库钱包吗?',
                        onOk: () => handleDelete(wallets.dcbox?.id as string, wallets.dcbox?.currency as string)
                      })}
                    >
                      <span><IconTrash /></span>
                      <label>删除钱包</label>
                    </button>
                  ) : null
                }
              </div>
            ) : (
              <div
                className="wallet-add"
                onClick={() => addWallet(Currency.DCBOX)}
              >
                <IconDcbox />
                <div>添加小金库钱包</div>
                <a
                  target="_blank"
                  href="https://dcbox.com/about"
                  onClick={(event) => event.stopPropagation()}
                >什么是小金库钱包?<b>点我了解</b></a>
                <span className="recommend">极速到账‧尽收好路</span>
              </div>
            )
          ) : null
        }
        {/* USDT */}
        {
          wallets.usdtAllowed ? (
            wallets.usdt.map((w, i) => {
              if (!w) {
                return (
                  <div
                  key={i}
                    className="wallet-add"
                    onClick={() => addWallet(Currency.USDT)}
                  >
                    <IconUsdt />
                    <div>添加USDT钱包</div>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="wallet-item wallet-usdt"
                >
                  <header>{getWalletName(w.walletType, w.bankName, w.currency)}</header>
                  <div className="number-decoration">
                    <IconIC />
                    <IconWifi />
                    <span>··········</span>
                  </div>
                  <div className="number">·····{w.cardNo.replace(/\*/gi, '')}</div>
                  <section>{w.name}</section>
                  <p>{w.walletProtocol}</p>
                  {
                    (
                      wallets.usdt.filter(Boolean).length
                      +
                      (wallets.dcbox ? 1 : 0)
                    ) > 1 ? (
                      <button
                        onClick={() => Modal.confirm({
                          icon: <ExclamationCircleOutlined />,
                          title: `删除${getWalletName(w.walletType, w.bankName, w.currency)}`,
                          content: '你确定要删除该银行卡吗?',
                          onOk: () =>  handleDelete(w.id, w.currency)
                        })}
                      >
                        <span><IconTrash /></span>
                        <label>删除钱包</label>
                      </button>
                    ) : null
                  }
                </div>
              );
            })
          ) : null
        }
        {/* 普通银行卡 */}
        {
          wallets.bankcardAllowed ? (
            wallets.bankcard.map((b, i) => {
              if (!b) {
                return (
                  <div
                    key={i}
                    className="wallet-add"
                    onClick={() => addWallet(Currency.CNY)}
                  >
                    <IconAdd />
                    <div>添加银行卡账户</div>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="wallet-item wallet-bankcard"
                >
                  <header>
                    <label>{b.bankName}</label>
                    <span>{b.type}</span>
                  </header>
                  <div className="number-decoration">
                    <IconIC />
                    <IconWifi />
                    <span>··········</span>
                  </div>
                  <div className="number">·····{b.cardNo.replace(/\*/gi, '')}</div>
                  <section>{b.name}</section>
                  <p>{b.province} {b.city} {b.branch}</p>
                  {
                    wallets.bankcard.filter(Boolean).length > 1 ? (
                      <button
                        onClick={() => Modal.confirm({
                          icon: <ExclamationCircleOutlined />,
                          title: '删除银行卡',
                          content: '你确定要删除该银行卡吗?',
                          onOk: () => handleDelete(b.id, b.currency)
                        })}
                      >
                        <span><IconTrash /></span>
                        <label>删除钱包</label>
                      </button>
                    ) : null
                  }
                </div>
              );
            })
          ) : null
        }
      </div>
      {/* 验证弹窗(谷歌验证器或短信验证码) */}
      <Dialog
        open={verify.verifying}
        closeButton
        imgbg
        className="wallet-verify-dialog"
        onClose={() => setVerify(verify => ({ ...verify, verifying: false }))}
      >
        <header>身份验证</header>
        {
          (
            verify.verifyInfo?.googleBindStatus
            &&
            verify.googleMode
          ) ? (
            <>
              <p>为确保是您本人操作，使用谷歌验证器完成身份验证。</p>
              <div className="input-item google-verify">
                <label>G</label>
                <div>
                  <input
                    type="text"
                    placeholder="请输入谷歌验证器中的6位数字"
                    maxLength={6}
                    value={captcha.value}
                    onChange={({ target: { value } }) => setCaptcha(old => ({ ...old, value: value.replace(/\D+/gi, '') }))}
                  />
                </div>
              </div>
              <div className="remark">
                {
                  verify.verifyInfo?.googleBindStatus ? (
                    <>
                      <a onClick={() => setVerify(v => ({ ...v, googleMode: !v.googleMode }))}>
                        使用<b>{verify.googleMode ? '短信' : '谷歌'}验证</b>
                      </a>
                      <i />
                    </>
                  ) : null
                }
                <OnlineCustomerService>
                  遇到问题了吗?联系<b>在线客服</b>
                </OnlineCustomerService>
              </div>
              <button
                className={mergeClass({
                  submit: true,
                  'single-submit': true,
                  available: (
                    !captcha.checking
                    &&
                    captcha.value.length === 6
                  )
                })}
                onClick={handleGoogleCheck}
              >
                {
                  captcha.checking
                  ? <LoadingBar />
                  : '下一步'
                }
              </button>
            </>
          ) : (
            <>
              <p>为确保是您本人操作，<br />请在以下输入框完善信息后点击发送验证码</p>
              <div className="input-item phone-number">
                <label>
                  <b>*</b>手机号码:
                </label>
                <div>
                  <span className="country-code">{verify.verifyInfo?.countryCode}</span>
                  <span className="input">
                    <span>{prefix}</span>
                    <input
                      type="text"
                      placeholder="请补充电话号码"
                      maxLength={suffix ? 7 : 8}
                      value={captcha.number}
                      onChange={({ target: { value } }) => setCaptcha(old => ({ ...old, number: value.replace(/\D+/gi, '') }))}
                    />
                    <span>{suffix}</span>
                  </span>
                </div>
              </div>
              <div className="input-item captcha">
                <label>
                  <b>*</b>验证码:
                </label>
                <div>
                  <span className="input">
                    <input
                      type="text"
                      placeholder="请输入验证码"
                      value={captcha.value}
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
              <div className="remark">
                {
                  verify.verifyInfo?.googleBindStatus ? (
                    <>
                      <a onClick={() => setVerify(v => ({ ...v, googleMode: !v.googleMode }))}>
                        使用<b>{verify.googleMode ? '短信' : '谷歌'}验证</b>
                      </a>
                      <i />
                    </>
                  ) : null
                }
                <OnlineCustomerService>
                  遇到问题了吗?联系<b>在线客服</b>
                </OnlineCustomerService>
              </div>
              <button
                className={mergeClass({
                  submit: true,
                  'single-submit': true,
                  available: !captcha.checking && captcha.value.length === 6
                })}
                onClick={
                  captcha.sending
                  ? undefined
                  : handleCheckCaptcha
                }
              >
                {
                  captcha.checking
                  ? <LoadingBar />
                  : '完成验证'
                }
                </button>
            </>
          )
        }
      </Dialog>
      <WalletDialog
        open={adding}
        currency={verify.currency as Currency}
        walletType={verify.type as string}
        accountName={wallets.accountName}
        onClose={() => setAdding(false)}
        onFinish={handleFinish}
      />
    </MemberLayout>
  );
}

export default WalletPage;
