import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Modal, Toast } from 'antd-mobile';
import { useApi } from '../../../../apis';
import User from '../../../../apis/User';
import LoadingBar from '../../../../components/common/LoadingBar';
import NavBar from '../../../../components/common/NavBar';

import IconDcbox from '../Wallet/icons/IconDcbox';
import IconUsdt from '../Wallet/icons/IconUsdt';
import IconBankcard from '../Wallet/icons/IconBankcard';
import mergeClass from '../../../../utils/mergeClass';

import memberStore from '../../../../stores/member';
import { MainSitePath, MEMBER_RELOAD_EVENT } from '../../../../consts/app';
import { toMainSite } from '../../../../utils/MainSiteUtils';
import { getCustomerServiceUrlSync } from '../../../../apis/SyncApi';
import CreditPasswordVerify from '../../../../components/member/CreditPasswordVerify';
import RealnameDialog from '../../../../components/member/RealnameDialog';

const NAMES: Record<string, string> = {
  'USDT_DCBOX': '小金库',
  'USDT_huobi': '火币钱包',
  'USDT_火币 Huobi': '火币钱包',
};

const ICONS: Record<string, JSX.Element> = {
  'USDT_DCBOX': <IconDcbox />,
  'USDT_huobi': <IconUsdt />,
  'USDT_火币 Huobi': <IconUsdt />,
  'CNY_': <IconBankcard />
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

function Withdrawal () {

  const history = useHistory();

  const realnameRef = React.useRef<any>();
  const { user } : { user: User } = useApi({ user: User });

  const [withdrawalInfo, setWithdrawalInfo] = React.useState<{
    availableBalance: 0,
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
  } | undefined>();

  const [creditPassVerifying, setCreditPassVerifying] = React.useState(false);

  const [currentWallet, setCurrentWallet] = React.useState<Bank>();
  const [loading, setLoading] = React.useState(true);
  const [rate, setRate] = React.useState({
    loading: false,
    loaded: false,
    value: 0
  });

  const [balance, setBalance] = React.useState({
    loading: true,
    totalBalance: 0,
    availableBalance: 0,
  });
  const [amount, setAmount] = React.useState('');

  const valid = (
    !rate.loading
    &&
    !balance.loading
    &&
    Number(amount) >= Number(
      // currentWallet?.currency === 'CNY'
      // ? withdrawalInfo?.minAmount
      // : withdrawalInfo?.usdtMinAmount
      withdrawalInfo?.usdtMinAmount
    )
    &&
    Number(amount) <= Math.min(
      Number(balance.availableBalance),
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
      Modal.alert(
        '您未绑定小金库钱包',
        '需要绑定小金库钱包才可使用银行卡提现功能',
        [
          { text: '取消' },
          {
            text: '查看记录',
            onPress: () => history.push('/member/wallet')
          }
        ]
      );
      return;
    }
    if (!valid) {
      return
    }
    // 火币弹窗提示
    if (currentWallet?.walletType.toLocaleLowerCase().includes('huobi')) {
      await new Promise((resolve) => {
        Modal.alert(
          '火币交易所风险提示',
          <p>
            受政策影响，火币交易所存在一定风险隐患，暂不推荐使用。
            <br />
            <span>推荐使用小金库钱包，快速安全到账</span>
          </p>,
          [
            { text: '取消' },
            { text: '继续提现', onPress: resolve }
          ]
        );
      });
    }

    Toast.loading('正在处理,请稍后...');
    const {
      successful,
      code,
      msg,
      data,
      ...result
    } = await (
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
    Toast.hide();

    if (successful) {
      Modal.alert(
        '提交成功',
        (
          // 首次取款, 提示工作人员将会致电
          code === 1
          ? (<p>恭喜您进行首次提现，为了您的资金安全，工作人员将会在30分钟内，致电为您核实提现信息。</p>)
          : (
            <p>您的提币将尽速支付到账<br /><br />充币后达到1倍流水即可申请提币；如享受优惠则需完成对应流水要求才可提币。</p>
          )
        ),
        [
          { text: '我知道了' },
          {
            text: '查看记录',
            onPress: () => history.push('/member/records')
          }
        ]
      );
      return;
    }

    // TODO 提取常量
    switch (code) {
      // 6036 需要输入资金安全密码 
      // TODO 修改为输入密码的弹窗
      case 6036:
        // Modal.alert(
        //   undefined,
        //   (
        //     <div>因为您已开启资金安全密码，九游体育暂不支持以资金安全密码提现，请前往<b>九游会</b>提现或关闭资金安全密码。</div>
        //   ),
        //   [
        //     { text: '取消' },
        //     {
        //       text: '立即前往',
        //       onPress: () => new Promise<void>((resolve) => {
        //         resolve();
        //         toMainSite(MainSitePath.WITHDRAWAL, true);
        //       })
        //     }
        //   ]
        // );
        setCreditPassVerifying(true);
        break;
      // 8535 流水不达标
      case 8535:
        Modal.alert(
          undefined,
          (
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
          [
            {
              text: '继续投注',
              // 跳转地址
              onPress: () => history.replace('/')
            },
            {
              text: '提交',
              onPress: () => new Promise<void>((resolve) => {
                resolve();
                handleSubmit(false);
              })
            }
          ]
        );
        break;
      // 8537 某优惠五天要求未达标
      case 8537:
        Modal.alert(
          undefined,
          (
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
          [
            { text: '取消' },
            {
              text: '确定',
              async onPress () {
                try {
                  Toast.loading('正在处理,请稍后...');
                  const result = await user.approvePromoForWithdrawal();
                  Toast.hide();
                  if (result.successful) {
                    Toast.success('优惠金额扣除成功！');
                  } else {
                    Toast.fail(result.msg || '优惠金额扣除失败，请联系客服！');
                  }
                } catch {
                  Toast.fail('出错了,请稍后再试!');
                }
                return Promise.resolve();
              }
            }
          ]
        );
        break;
      // 8522 未绑定小金库钱包 
      case 8522:
        Modal.alert(
          '您未绑定小金库钱包',
          '需要绑定小金库钱包才可使用银行卡提现功能',
          [
            { text: '取消' },
            {
              text: '绑定小金库',
              onPress: () => history.push('/member/wallet')
            }
          ]
        );
        break;
      // 8901 支付渠道已升级
      case 8901:
        Modal.alert(
          undefined,
          (
            <div className="channel-upgrade">
              USDT支付渠道已升级，请到银行资料，
              先<b>删除</b>USDT钱包，再<b>重新绑定</b>。
            </div>
          ),
          [{
            text: '确定',
            onPress: () => history.push('/member/wallet')
          }]
        );
        break;
      // 8534 当前汇率已经发生变化(最新汇率:{0})，请重新提交
      case 8534:
        Modal.alert(
          undefined,
          msg,
          [
            { text: '取消' },
            {
              text: '重新提交',
              onPress: () => new Promise<void>(resolve => {
                resolve();
                handleSubmit();
              })
            }
          ]
        );
        break;
      // 8515 提现前需扣除福利码金额
      case 8515:
        const promotionRequestId = result.promotionRequestId;
        Modal.alert(
          undefined,
          msg,
          [
            { text: '取消' },
            {
              text: '确定',
              onPress: async () => {
                try {
                  const deductResult = await user.promoDeductForWithdrawal({ promotionRequestId });
                  if (deductResult.successful) {
                    Toast.success('扣除成功');
                  } else {
                    Toast.fail('扣除失败');
                  }
                } catch {}
                // TODO 重新查询额度
              }
            }
          ]
        );
        break;
      // 8514	由于您申请过福利码，提现请联系在线客服
      case 8514:
      // 8521 尚未绑定真实姓名，请联系客服确认
      case 8521:
      /** 8519 人民币取款额度超出限额 */
      case 8519:
        if (msg.indexOf("在线客服") != -1 || msg.indexOf("联系客服") != -1) {
          Modal.alert(
            undefined,
            msg,
            [
              { text: '取消' },
              {
                text: '联系客服',
                onPress () {
                  // window.open(appStore.customerServiceUrl);
                  try {
                    const url = getCustomerServiceUrlSync();
                    window.open(url);
                  } catch (e) {
                    console.error(e);
                    Toast.fail('获取在线客服地址失败,请稍后再试.')
                  }
                }
              }
            ]
          );
        } else {
          Modal.alert(
            undefined,
            msg,
            [{ text: '我知道了' }]
          );
        }
        break;
      // 8513 不处理
      default:
        Modal.alert(
          undefined,
          msg || '提交取款时服务器发生异常,请稍后再试!',
          [{ text: '确定' }]
        );
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
      (async () => {
        if (!realnameRef.current) {
          return;
        }
        const verified = await realnameRef.current?.checkVerify();
        if (!verified) {
          history.replace('/tab/member');
          return;
        }
      })();
      Promise.all([
        user.withdrawalWallets(),
        user.userBalance()
      ]).then(([walletInfo, balance]) => {
        if (walletInfo.bankList.length) {
          setWithdrawalInfo(walletInfo);
          setCurrentWallet(walletInfo.bankList[0]);
        }
        if (balance) {
          setBalance({
            loading: false,
            totalBalance: balance.totalBalance,
            availableBalance: balance.availableBalance
          });
        }
      }).finally(
        () => setLoading(false)
      );

      return () => {
        memberStore.reload();
      }
    },
    [user]
  );

  return (
    <>
      <NavBar
        title="提现"
        center
      />
      {
        loading ? (
          <div className="scrollable-match-list fullscreen">
            <LoadingBar className="full" />
          </div>
        ) : (
          <>
          <div className="withdrawal-page">
            <div className="balance">
              <label>账户总余额:</label>
              <span>{balance.totalBalance}USDT</span>
            </div>
            <div className="wallet-list">
              <header>
                <label>提现到</label>
                <Link to="/member/wallet">添加收款方式</Link>
              </header>
              {
                withdrawalInfo?.bankList.map(item => (
                  <button
                    key={item.id}
                    className={
                      item === currentWallet
                      ? 'active'
                      : undefined
                    }
                    onClick={() => setCurrentWallet(item)}
                  >
                    {ICONS[`${item.currency}_${item.walletType || ''}`]}
                    <label>
                      {
                        item.currency === 'CNY'
                        ? item.bankName
                        : NAMES[`${item.currency}_${item.walletType}`]
                      }
                    </label>
                    {
                      item.accountNo
                      ? <span>尾号: {item.accountNo}</span>
                      : null
                    }
                    {
                      item.walletType === 'DCBOX'
                      ? <i className="dcbox-tip">快捷到账</i>
                      : null
                    }
                    <span className="radio">
                      <i />
                    </span>
                  </button>
                ))
              }
            </div>
            <div className="withdrawal-amount">
              <header>
                <label>提现金额</label>
                <span>
                  {
                    currentWallet?.currency === 'CNY' ? (
                      rate.loading
                      ? <LoadingBar />
                      : `当前汇率: 1USDT = ${rate.value}元`
                    ) : null
                  }
                </span>
              </header>
              <section>
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
                    if (newValue > balance.availableBalance) {
                      newValue = balance.availableBalance;
                    }
                    setAmount(String(newValue || ''));
                  }}
                />
                <div className="amount-tip">
                  {
                    currentWallet?.currency === 'CNY'
                    ? `预计银行卡到账: ${(+amount || 0) * rate.value}元`
                    : 'USDT'
                  }
                </div>
              </section>
            </div>

            <button
              className={mergeClass({
                submit: true,
                available: valid
              })}
              onClick={() => handleSubmit(true)}
            >确认提现</button>
            <div className="tips">
              <p>*提现不限次数，金额无上限，无手续费，快速到账且短信通知；</p>
              <p>*充币后达到1倍流水即可申请提现；如享受优惠则需完成对应流水要求才可提现。</p>
            </div>
          </div>
          <CreditPasswordVerify
            open={creditPassVerifying}
            onClose={() => setCreditPassVerifying(false)}
            onFinish={() => {
              Toast.info('验证成功,重新提交中...');
              setCreditPassVerifying(false);
              handleSubmit();
            }}
          />
          </>
        )
      }

      <RealnameDialog ref={realnameRef} />
    </>
  );
}

export default Withdrawal;
