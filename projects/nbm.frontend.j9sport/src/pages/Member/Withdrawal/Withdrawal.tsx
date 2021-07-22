import React from 'react';
import { Link } from 'react-router-dom';
import mergeClass from '../../../utils/mergeClass';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router';
import { useApi } from '../../../apis';
import User from '../../../apis/User';
import LoadingBar from '../../../components/common/LoadingBar';
import MemberLayout from '../../../components/member/MemberLayout';

// import IconLinearUsdt from '../Wallet/icons/IconUsdt';

import appStore from '../../../stores/app';

import IconLinearUsdt from '../Recharge/images/icon-linear-usdt.svg';
import IconWithdrawalUsdt from './images/icon-withdrawal-usdt.svg';
import IconWithdrawalCny from './images/icon-withdrawal-cny.svg';
import DcboxDownloadImage from './images/dcbox-download-button.jpg';
import DcboxRegisterAdImage from './images/dcbox-register@2x.jpg';
import QrcodePritzeAdImage from './images/qr-code-pritze@2x.jpg';
import { message, Modal } from 'antd';
import { CheckOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { MEMBER_RELOAD_EVENT, MainSitePath } from '../../../consts/app';

import { OtherPaymentDialog } from '../Recharge/Recharge';
import memberStore from '../../../stores/member';
import { observer } from 'mobx-react';
import { toMainSite } from '../../../utils/MainSiteUtils';
import { getCustomerServiceUrlSync } from '../../../apis/SyncApi';
import CreditPasswordDialog from '../../../components/member/CreditPasswordDialog';
import CreditPasswordVerify from '../../../components/member/CreditPasswordVerify';

const NAMES: Record<string, string> = {
  'USDT_DCBOX': '小金库',
  'USDT_huobi': '火币钱包',
  'USDT_火币 Huobi': '火币钱包',
};

// const ICONS: Record<string, JSX.Element> = {
//   'USDT_DCBOX': <IconDcbox />,
//   'USDT_huobi': <IconUsdt />,
//   'USDT_火币 Huobi': <IconUsdt />,
//   'CNY_': <IconBankcard />
// };

type WithdrawalInfo = {
  withdrawalBalance: 0,
  beginDate: string,
  btcMinAmount: number,
  maxAmount: number
  minAmount: number
  nowTime: number,
  realNameHide: string,
  toDcboxRate: number,
  usdtMinAmount: number,
  withdrawCNYFlag: boolean
  withdrawal2DcboxFlag: boolean,
  yuebaoMinAmount: number,
  bankList: Array<Bank>
};
type Bank = {
  accountNo: string,
  bankName: string,
  binded: boolean,
  currency: string,
  enable: boolean,
  id: number,
  walletType: string
};

const WITHDRAWAL_CHANNEL = [
  {
    type: 'USDT',
    url: '/member/withdrawal/usdt',
    icon: IconWithdrawalUsdt,
    text: '快捷提现'
  },
  {
    type: 'CNY',
    url: '/member/withdrawal/cny',
    icon: IconWithdrawalCny,
    text: '人民币提现'
  }
];

/** 取款页面内容 */
const WithdrawalContent = observer((
  {
    type = 'usdt',
    withdrawalInfo,
    wallets = []
  } : {
    type?: 'cny' | 'usdt',
    withdrawalInfo: WithdrawalInfo,
    wallets: Array<Bank>
  }
) => { 
  const history = useHistory();
  const { user } : { user: User } = useApi({ user: User });

  const [submiting, setSubmiting] = React.useState(false);
  const [currentWallet, setCurrentWallet] = React.useState<Bank | undefined>(
    wallets?.length ? wallets[0] : undefined
  );

  const [rate, setRate] = React.useState({
    loading: false,
    loaded: false,
    value: 0
  });

  const [otherPaymentDialog, setOtherPaymentDialog] = React.useState(false);
  const [creditPassVerifying, setCreditPassVerifying] = React.useState(false);

  const [amount, setAmount] = React.useState('');

  const valid = (
    !rate.loading
    &&
    !memberStore.j9Reloading
    &&
    Number(amount) >= Number(
      // currentWallet?.currency === 'CNY'
      // ? withdrawalInfo?.minAmount
      // : withdrawalInfo?.usdtMinAmount
      withdrawalInfo?.usdtMinAmount
    )
    &&
    Number(amount) <= Math.min(
      Number(memberStore.j9Balance.withdrawableBalance),
      Number(withdrawalInfo?.maxAmount)
    )
  );

  const handleSubmit = async (check: boolean | undefined = true) => {
    // 小金库弹窗提示
    if (
      currentWallet?.walletType === 'DCBOX'
      &&
      !currentWallet?.id
    ) {
      // 重新查询额度
      window.dispatchEvent(new Event(MEMBER_RELOAD_EVENT));
      Modal.confirm({
        title: '您未绑定小金库钱包',
        content: '需要绑定小金库钱包才可使用银行卡提现功能',
        cancelText: '取消',
        okText: '绑定小金库',
        onOk: () => history.push('/member/wallet')
      });
      return;
    }
    if (!valid) {
      return
    }
    // 火币钱包警告提示
    if (currentWallet?.walletType.toLocaleLowerCase().includes('huobi')) {
      await new Promise((resolve) => {
        Modal.warning({
          icon: <ExclamationCircleOutlined />,
          title: '火币交易所风险提示',
          content: (
            <p>
              受政策影响，火币交易所存在一定风险隐患，暂不推荐使用。
              <br />
              <span>推荐使用小金库钱包，快速安全到账</span>
            </p>
          ),
          onOk: () => {
            resolve(undefined);
            return Promise.resolve()
          }
        });
      });
    }

    setSubmiting(true);
    try {
      const withdrawalResult = await (
        currentWallet?.currency === 'CNY'
        ? user.withdrawalCny({
          bankId: currentWallet.id,
          withdrawAmount: +amount,
          check
        })
        : user.withdrawalVirtual({
          amount: +amount,
          currency: currentWallet?.currency as string,
          id: currentWallet?.id as number,
          check
        })
      );

      const {
        successful,
        code,
        msg,
        data,
        ...result
      } = withdrawalResult;

      if (successful) {
        // 重新查询额度
        window.dispatchEvent(new Event(MEMBER_RELOAD_EVENT));
        setAmount('');
        Modal.confirm({
          icon: <CheckOutlined />,
          title: '提交成功',
          content: (
            // 首次取款, 提示工作人员将会致电
            code === 1
            ? (<p>恭喜您进行首次提现，为了您的资金安全，工作人员将会在30分钟内，致电为您核实提现信息。</p>)
            : (
              <p>
                您的提币将尽速支付到账
                <br /><br />
                充币后达到1倍流水即可申请提币；如享受优惠则需完成对应流水要求才可提币。
              </p>
            )
          ),
          cancelText: '我知道了',
          okText: '查看记录',
          onOk: () => history.push('/member/amount-records')
        });
        return;
      }
      // 提取常量
      switch (code) {
        // 6036 需要输入资金安全密码 
        // TODO 修改为输入密码的弹窗
        case 6036:
          // Modal.confirm({
          //   content: (
          //     <div>
          //       因为您已开启资金安全密码，九游体育暂不支持以资金安全密码提现，请前往<b>九游会</b>提现或关闭资金安全密码。
          //     </div>
          //   ),
          //   cancelText: '取消',
          //   okText: '立即前往',
          //   onOk: () => new Promise<void>(resolve => {
          //     resolve();
          //     toMainSite(MainSitePath.WITHDRAWAL, true);
          //   })
          // });
          // Modal.confirm({
          //   content: (
          //     <div className="withdrawal-credit-password-dialog">
          //       <header>请输入六位资金密码</header>
          //     </div>
          //   ),
          //   cancelText: '取消',
          //   okText: '立即前往',
          //   onOk: () => new Promise<void>(resolve => {
          //     resolve();
          //     toMainSite(MainSitePath.WITHDRAWAL, true);
          //   })
          // });
          setCreditPassVerifying(true);
          break;
        // 8535 流水不达标
        case 8535:
          Modal.confirm({
            content: (
              <div className="total-bet-undone">
                <div>系统查询到您暂未完成流水要求</div>
                {
                  (
                    data.checkTransWrap?.details
                    &&
                    Array.isArray(data.checkTransWrap?.details)
                    &&
                    data.checkTransWrap?.details?.length
                  ) ? (
                    <table>
                      <thead>
                        <tr>
                          <th>您已添加</th>
                          <th>流水要求</th>
                          <th>您还差</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data.checkTransWrap?.details?.map((item: any, i: number) => (
                            <tr key={i}>
                              <td>{item.auditItemName}</td>
                              <td>
                                流水要求: {item.betAmountDesc}
                                <br />
                                您已完成: {item.betAmount}
                              </td>
                              <td>{item.needBetAmount}</td>
                            </tr>  
                          ))
                        }
                        <tr key="total">
                          <td colSpan={2}>数据有可能延迟10分钟</td>
                          <td>
                            {
                              Number(
                                data.checkTransWrap?.details?.reduce(
                                  (previous: number, item: any) => previous + item.needBetAmount,
                                  0
                                )
                              ).toFixed(2)
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : null
                }
                <p>数据有可能延迟10分钟,如未完成流水要求，提现将会被拒绝，是否要继续提交申请？</p>
              </div>
            ),
            cancelText: '继续投注',
            onCancel: () => history.replace('/'),
            okText: '提交',
            onOk: () => new Promise<void>(resolve => {
              resolve();
              handleSubmit(false);
            })
          });
          break;
        // 8537 某优惠五天要求未达标
        case 8537:
          Modal.confirm({
            content: (
              <div className="promo-bet-undone">
                <header>您已申请{data.actName}，需要在五天内完成流水要求</header>
                <section>
                  <div>
                    <label>流水要求</label>
                    <span>{data.postulateAccount}</span>
                  </div>
                  <div>
                    <label>五天内完成:</label>
                    <span>{data.validAccount}</span>
                  </div>
                </section>
                <p>提现前需要扣除您的优惠金额{data.receiveAmount}USDT</p>
              </div>
            ),
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
              const hide = message.loading('正在处理,请稍后...');
              try {
                const result = await user.approvePromoForWithdrawal();
                if (result.successful) {
                  message.success('优惠金额扣除成功！');
                } else {
                  message.warning(result.msg || '优惠金额扣除失败，请联系客服！');
                }
              } catch {
                message.warning('出错了,请稍后再试!');
              } finally {
                hide();
              }
              return Promise.resolve();
            }
          });
          break;
        // 8522 未绑定小金库钱包 
        case 8522:
          Modal.confirm({
            title: '您未绑定小金库钱包',
            content: '需要绑定小金库钱包才可使用银行卡提现功能',
            cancelText: '取消',
            okText: '绑定小金库',
            onOk: () => history.push('/member/wallet')
          });
          break;
        // 8901 支付渠道已升级
        case 8901:
          Modal.warning({
            content: (
              <div className="channel-upgrade">
                USDT支付渠道已升级，请到银行资料，
                先<b>删除</b>USDT钱包，再<b>重新绑定</b>。
              </div>
            ),
            okText: '确定',
            onOk: () => history.push('/member/wallet')
          });
          break;
        // 8534 当前汇率已经发生变化(最新汇率:{0})，请重新提交
        case 8534:
          Modal.confirm({
            content: msg,
            cancelText: '取消',
            okText: '重新提交',
            onOk: () => new Promise<void>(resolve => {
              resolve();
              handleSubmit();
            })
          });
          break;
        // 8515 提现前需扣除福利码金额
        case 8515:
          const promotionRequestId = result.promotionRequestId;
          Modal.confirm({
            content: msg,
            cancelText: '取消',
            okText: '重新提交',
            onOk: async () => {
              try {
                const deductResult = await user.promoDeductForWithdrawal({ promotionRequestId });
                if (deductResult.successful) {
                  message.success('扣除成功');
                } else {
                  message.warning('扣除失败');
                }
              } catch {}
              setAmount('');
              // 重新查询额度
              window.dispatchEvent(new Event(MEMBER_RELOAD_EVENT));
            }
          });
          break;
        // 8514	由于您申请过福利码，提现请联系在线客服
        case 8514:
        // 8521 尚未绑定真实姓名，请联系客服确认
        case 8521:
        /** 8519 人民币取款额度超出限额 */
        case 8519:
          if (msg.indexOf("在线客服") != -1 || msg.indexOf("联系客服") != -1) {
            Modal.warning({
              content: msg,
              cancelText: '取消',
              okText: '联系客服',
              onOk: () => {
                // window.open(appStore.customerServiceUrl);
                try {
                  const url = getCustomerServiceUrlSync();
                  window.open(url);
                } catch (e) {
                  message.warning('获取在线客服地址失败,请稍后再试.')
                }
                return Promise.resolve()
              }
            });
          } else {
            Modal.warning({
              content: msg,
              cancelText: '取消',
              okText: '我知道了',
              onOk: () => Promise.resolve()
            });
          }
          break;
        // 8513 不处理
        default:
          Modal.warning({
            content: msg || '提交取款时服务器发生异常,请稍后再试!',
            okText: '确定',
            onOk: () => Promise.resolve()
          });
      }
    } finally {
      setSubmiting(false);
    }
  };

  React.useEffect(
    () => {
      if (
        !currentWallet
        ||
        currentWallet.currency !== 'CNY'
        ||
        rate.loaded
      ) {
        return;
      }

      setRate(rate => ({ ...rate, loading: true }));
      user.withdrawalRate('USDT').then(value => setRate(rate => ({
        ...rate,
        value,
        loading: false,
        loaded: true
      })));
    },
    [currentWallet, setRate]
  );

  React.useEffect(
    () => {
      setCurrentWallet(
        wallets?.length
        ? wallets[0]
        : undefined
      )
    },
    [wallets]
  );

  return (
    <section className="withdrawal-content">
      <div className="form">
        <Link
          to="/member/wallet"
          className="dcbox-button"
        >
          <img src={DcboxDownloadImage} />
        </Link>
        <div className="balance">
          <label>可提现总余额:</label>
          <span>
            {
              memberStore.j9Reloading
              ? <>加载中...</>
              : `${Number(memberStore.j9Balance.withdrawableBalance).toFixed(2)} USDT`
            }
            <button
              className={mergeClass({
                'btn-reload': true,
                'available': memberStore.j9Reloading,
              })}
              onClick={() => {
                if (!memberStore.j9Reloading) {
                  window.dispatchEvent(new Event(MEMBER_RELOAD_EVENT));
                }
              }}
            >
              {
                memberStore.j9Reloading
                ? <LoadingBar />
                : <SyncOutlined />
              }
            </button>
          </span>
        </div>
        <div className="wallet">
          <label>提现到</label>
          {
            wallets.map(w => (
              <button
                key={w.id}
                className={mergeClass({
                  'wallet-item': true,
                  active: w === currentWallet
                })}
                onClick={() => setCurrentWallet(w)}
              >
                <label>
                  {
                    w.currency === 'CNY'
                    ? w.bankName
                    : NAMES[`${w.currency}_${w.walletType}`]
                  }
                </label>
                {
                  w.accountNo
                  ? <span>尾号: {w.accountNo}</span>
                  : null
                }
                {
                  w.walletType === 'DCBOX'
                  ? <var className="dcbox-tip"><i>快捷到账</i></var>
                  : (
                    w.walletType.toLocaleLowerCase() === 'huobi'
                    ? <var className="huobi-tip">该交易所存在风险，推荐小金库提现</var>
                    : <var></var>
                  )
                }
              </button>
            ))
          }
          {
            wallets.length < 3 ? (
              <Link
                to="/member/wallet"
                className="withdrawal-add-wallet"
              >
                + 添加收款钱包
              </Link>
            ) : null
          }
        </div>
        <div className="amount">
          <label>
            提现金额
            <span>
            {
                currentWallet?.currency === 'CNY' ? (
                  rate.loading
                  ? <LoadingBar />
                  : `(当前汇率: 1USDT = ${rate.value}元)`
                ) : null
              }
            </span>
          </label>
          <div>
            <img src={IconLinearUsdt} />
            <span className="input">
              <input
                type="text"
                value={amount}
                placeholder={
                  `最低提币金额 ${
                    // currentWallet?.currency === 'CNY'
                    // ? withdrawalInfo?.minAmount
                    // : `${withdrawalInfo?.usdtMinAmount}USDT`
                    withdrawalInfo?.usdtMinAmount
                  }`
                }
                onChange={({ target: { value } }) => {
                  let newValue = +value.replace(/\D+/g, '');
                  if (newValue > memberStore.j9Balance.withdrawableBalance) {
                    newValue = memberStore.j9Balance.withdrawableBalance;
                  }
                  setAmount(String(newValue || ''));
                }}
              />
            </span>
            <span>USDT</span>
          </div>
        </div>
        <div className="buttons">
          <button
            className={mergeClass({
              submit: true,
              'full-single-submit': true,
              available: !submiting && valid
            })}
            onClick={
              submiting
              ? undefined
              : () => handleSubmit()
            }
          >
            {
              submiting
              ? <LoadingBar />
              : '确认提交'
            }
          </button>
        </div>
        <div className="tips">
          <p>* 提现不限次数，金额无上限，无手续费，快速到账且短信通知；</p>
          <p>* 充值后达到1倍流水即可申请提现；如享受优惠则需要完成对应流水要求才可提现。</p>
        </div>
      </div>
      <div className="image">
        {
          type === 'cny' ? (
            <Link to="/member/wallet">
              <img src={DcboxRegisterAdImage} />
            </Link>
          ) : (
            // <Link to="/member/recharge/usdt-guide">
            //   <img src={QrcodePritzeAdImage} />
            // </Link>
            // <a onClick={() => setOtherPaymentDialog(true)}>
            //   <img src={QrcodePritzeAdImage} />
            // </a>
            undefined
          )
        }
      </div>

      <OtherPaymentDialog
        open={otherPaymentDialog}
        onClose={() => setOtherPaymentDialog(false)}
      />
      <CreditPasswordVerify
        open={creditPassVerifying}
        onClose={() => setCreditPassVerifying(false)}
        onFinish={() => {
          message.info('验证成功,重新提交中...');
          setCreditPassVerifying(false);
          handleSubmit();
        }}
      />
    </section>
  );
})

/** 取款页面 */
function Withdrawal () {
  const location = useLocation();

  const { user } : { user: User } = useApi({ user: User });
  const [withdrawalInfo, setWithdrawalInfo] = React.useState<WithdrawalInfo | undefined>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(
    () => {
      user.withdrawalWallets().then(withdrawalInfo => {
        if (!withdrawalInfo.bankList) {
          withdrawalInfo.bankList = [];
        }
        setWithdrawalInfo(withdrawalInfo);
      }).finally(
        () => setLoading(false)
      )
    },
    [user]
  );

  if (loading) {
    return <LoadingBar />;
  }

  return (
    <MemberLayout
      title="提现"
      subTitle="WITHDRAWAL"
      className="seperated withdrawal-page"
    >
      <div className="left-bar">
        {
          WITHDRAWAL_CHANNEL.map((item, i) => (
            (
              item.type === 'CNY'
              &&
              !withdrawalInfo?.withdrawCNYFlag
            ) ? null : (
              <Link
                key={i}
                to={item.url}
                className={
                  location.pathname === item.url
                  ? 'active'
                  : undefined
                }
              >
                <label>{item.text}</label>
                <img src={item.icon} />
              </Link>
            )
          ))
        }
      </div>
      <div className="right-bar">
        {
          withdrawalInfo ? (
            <Switch>
              <Route exact path="/member/withdrawal">
                <Redirect to="/member/withdrawal/usdt" />
              </Route>
              <Route exact path="/member/withdrawal/usdt">
                <WithdrawalContent
                  type="usdt"
                  withdrawalInfo={withdrawalInfo}
                  wallets={withdrawalInfo.bankList.filter(w => w.currency === 'USDT')}
                />
              </Route>
              <Route path="/member/withdrawal/cny">
                <WithdrawalContent
                  type="cny"
                  withdrawalInfo={withdrawalInfo}
                  wallets={withdrawalInfo.bankList.filter(w => w.currency === 'CNY')}
                />
              </Route>
            </Switch>
          ) : null
        }
      </div>
    </MemberLayout>
  );
}

export default Withdrawal;
