import React from 'react';
import { PaymentChannel, PaymentGenre, PaymentGenres } from '../../../../../apis/Payment';
import { RechargeBlock } from '../Recharge';

import UnavailableImage from '../icons/unavailable.png';
import MaintainImage from '../icons/maintain.png';

import IconAlipayChannel from '../icons/IconAlipayChannel';
import IconBankcardChannel from '../icons/IconBankcardChannel';
import { useApi } from '../../../../../apis';
import Payment from '../../../../../apis/Payment';
import BankcardResult from './BankcardResult';
import QrConfirm from './QrConfirm';
import J9Button from '../../../../../components/common/J9Button';
import { scanqrPayment } from '../../../../../apis/SyncApi';

/** 充值类别名称 */
const GENRE_NAMES: Record<string, string> = {
  [PaymentGenres.BANK_CARD]: '人民币充值',
  [PaymentGenres.ALIPAY]: '支付宝支付'
};

/** 充值类别图标 */
const GENRE_ICONS: Record<string, JSX.Element>= {
  [PaymentGenres.BANK_CARD]: <IconAlipayChannel />,
  [PaymentGenres.ALIPAY]: <IconBankcardChannel />
};

/**
 * 过滤金额字符串的表达式
 *
 * * ([^\.\d]+) 匹配数字和小数点以外的字符
 * * ((?<=\..*)\.) 匹配第一个小数点之后的小数点
 * * ((?<=\..{2}).) 匹配小数点后两位之后的字符
 * 
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * * (?=pattern) 正向肯定预查，在任何匹配pattern的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如，“Windows(?=95|98|NT|2000)”能匹配“Windows2000”中的“Windows”，但不能匹配“Windows3.1”中的“Windows”。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
 * 
 * * (?<=pattern)	反向肯定预查，与正向肯定预查类拟，只是方向相反。例如，“(?<=95|98|NT|2000)Windows”能匹配“2000Windows”中的“Windows”，但不能匹配“3.1Windows”中的“Windows”。
 *
 * https://baike.baidu.com/item/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F
 *
 * ---------------------------------------------------------------------------------------------------------------------
 */
const AMOUNT_CLEANNER_PATTERN = /([^\.\d]+)|((?<=\..*)\.)|((?<=\..{2}).)/g;

// https://pc.uatnine.com/ucenter/pay/autoSubmit/

function CnyRecharge (
  {
    bankcard,
    alipay
  }: {
    bankcard: PaymentGenre,
    alipay: PaymentGenre
  }
) {

  const { payment }: { payment: Payment } = useApi({ payment: Payment })

  const [submiting, setSubmiting] = React.useState(false);
  const [qrSubmiting, setQrSubmiting] = React.useState(false);
  const [currentGenre, setCurrentGenre] = React.useState<PaymentGenre>(bankcard || alipay);
  const [currentChannel, setCurrentChannel] = React.useState<PaymentChannel>();
  const [amount, setAmount] = React.useState<string>('');

  // 银行卡汇款人
  const [depositor, setDepositor] = React.useState<string>('');
  // 银行卡支付结果
  const [bankcardResult, setBankcardResult] = React.useState<any>();
  
  // 扫码支付确认中
  const [qrConfirming, setQrConfirming] = React.useState(false);
  // 扫码支付结果
  const [qrResult, setQrResult] = React.useState<any>();

  // 金额输入是否正确
  const amountValid = Boolean(
    amount
    &&
    +amount >= (currentChannel?.minAmount as number)
    &&
    +amount <= (currentChannel?.maxAmount as number)
    &&
    (
      currentGenre.code !== PaymentGenres.BANK_CARD
      ||
      Boolean(depositor)
    )
  );

  const feeAmount = (+amount * Number(currentChannel?.fee) / 100) || 0;
  const resultAmount = Math.floor(((+amount - feeAmount) / currentGenre.rate) * 100) / 100;

  // 人民币充值 (银行卡转账)
  const handleBankcardSubmit = async () => {
    if (!amountValid) {
      return;
    }
    try {
      setSubmiting(true);
      // 提交转账提案请求
      const result = await payment.bankpay({
        accountName: depositor,
        amount: Number(amount),
        payType: Number(currentChannel?.payType)
      });
      setBankcardResult(result);
    } finally {
      setSubmiting(false);
    }
  };

  // 提交扫码支付
  const submitQrPayment = async () => {
    try {
      setQrSubmiting(true);
      // const result = await payment.scanqr({
      const result = scanqrPayment({
        payId: String(currentChannel?.payId),
        payType: currentChannel?.payType as string,
        amount: +amount,
        reChargeFeeRate: currentChannel?.fee as number,
        reChargeFeeAmount: resultAmount
      });
      const {
        protocol,
        host
      } = window.location;
      window.open(`${protocol}//${host}/pay-form${result.jumpLink}`);
      setQrResult(result);
      setQrConfirming(true);
    } finally {
      setQrSubmiting(false);
    }
  }

  // 首次提交扫码支付
  const handleQRSubmit = () => {
    if (!amountValid) {
      return;
    }
    // 如果没有手续费,则直接提交请求
    if (!currentChannel?.fee) {
      submitQrPayment();
      return;
    }
    // 如果有手续费则需要弹出确认框
    setQrConfirming(true);
  }

  // 修改支付类别时重置到新类别到第一个渠道
  React.useEffect(
    () => {
      const channel = currentGenre?.payChannels[0];
      setCurrentChannel(channel);
      // 重置金额
      if (
        channel
        &&
        currentGenre?.code === PaymentGenres.ALIPAY
        &&
        channel.amountList?.findIndex(a => String(a) === amount) === -1
      ) {
        setAmount(String((channel.amountList as string[])[0]));
      }
    },
    [currentGenre, setCurrentChannel, setAmount]
  );

  // 银行卡转账提交成功提示界面
  if (bankcardResult) {
    return (
      <BankcardResult
        rate={Number(currentGenre.rate).toFixed(2)}
        result={bankcardResult}
        channel={currentChannel as PaymentChannel}
        resultAmount={resultAmount}
        onCancel={() => setBankcardResult(undefined)}
      />
    );
  }

  return (
    <>
      <section className="cny-recharges">
        {/* 贵宾专享 */}
        <RechargeBlock
          title="贵宾专享"
          className="vip-genre"
        >
          <label>请选择充值渠道</label>
          <div className="genres">
            {
              [bankcard, alipay].filter(Boolean).map(item => (
                <button
                  key={item.code}
                  onClick={() => setCurrentGenre(item)}
                  className={item === currentGenre ? 'active' : undefined}
                >
                  {GENRE_ICONS[item.code]}
                  {GENRE_NAMES[item.code]}
                </button>
              ))
            }
          </div>
          {
            (
              currentGenre
              &&
              currentGenre.status !== -1
            ) ? (
              !currentGenre.payChannels?.length ? (
                <div className="recharge-unavailable">
                  <img src={MaintainImage} />
                  <p>该渠道维护中，请使用其它渠道充值</p>
                </div>
              ) : (
                <>
                  <label>选择类型</label>
                  <div className="channels">
                    {
                      currentGenre.payChannels.map(channel => (
                        <button
                          key={channel.code}
                          className={channel === currentChannel ? 'active' : undefined}
                          onClick={() => setCurrentChannel(channel)}
                        >
                          {channel.name}
                        </button>
                      ))
                    }
                  </div>
                  <label>充值金额<span>当前汇率：1USDT≈{Number(currentGenre.rate).toFixed(2)}CNY</span></label>
                  {
                    currentGenre.code === PaymentGenres.BANK_CARD ? (
                      <div className="amount">
                        <input
                          type="text"
                          placeholder={`充值金额${currentChannel?.minAmount}-${currentChannel?.maxAmount}`}
                          value={amount}
                          onChange={({ target: { value } }) => {
                            // let newValue = value.replace(AMOUNT_CLEANNER_PATTERN, '');
                            let newValue = value.replace(/\D/g, '');
                            setAmount(
                              newValue === '0'
                              ? ''
                              : newValue
                            );
                          }}
                        />
                        <span>元</span>
                      </div>
                    ) : (
                      <div className="amount-list">
                        {
                          currentChannel?.amountList?.map(aitem => (
                            <button
                              key={aitem}
                              className={String(aitem) === amount ? 'active' : undefined}
                              onClick={() => setAmount(String(aitem))}
                            >{aitem}</button>
                          ))
                        }
                      </div>
                    )
                  }
                  <div className="tips-bar exchanged-amount">
                    预计到账金额
                    <var>{resultAmount}</var>
                    USDT
                  </div>
                  {
                    currentGenre.code === PaymentGenres.BANK_CARD ? (
                      <>
                        {/* <p className="bankcard-tips">
                          建议存入特殊金额，款项能快速充值到您的账户<br />
                          例：5659.20、1733.56、778.78
                        </p> */}
                        <label>汇款人姓名</label>
                        <div className="depositor">
                          <input
                            type="text"
                            placeholder="请输入汇款人姓名"
                            value={depositor}
                            onChange={({ target: { value } }) => setDepositor(value)}
                          />
                        </div>
                      </>
                    ) : (
                      <br/>
                    )
                  }
                </>
              )
            ) : (
              <div className="recharge-unavailable">
                <img src={UnavailableImage} />
                <p>该渠道为贵宾专享，您还没有权限</p>
                <p>升级到<b>翡翠卡及以上</b>，可联系客服申请此渠道</p>
              </div>
            )
          }
        </RechargeBlock>
        {
          (
            currentGenre
            &&
            currentGenre.status !== -1
            &&
            currentGenre.payChannels?.length > 0
          ) ? (
            <div className="submit-container">
              <J9Button
                submit
                loading={submiting}
                available={!submiting && amountValid}
                onClick={
                  (
                    submiting
                    ||
                    !amountValid
                  ) ? undefined : (
                    currentGenre.code === PaymentGenres.BANK_CARD
                    ? handleBankcardSubmit
                    : handleQRSubmit
                  )
                }
              >
                确认提交
              </J9Button>
            </div>
          ) : null
        }
      </section>
      <QrConfirm
        open={qrConfirming}
        channel={currentChannel}
        amount={+amount}
        feeAmount={feeAmount}
        resultAmount={resultAmount}
        rate={currentGenre.rate}
        result={qrResult}
        qrSubmiting={qrSubmiting}
        onClose={() => {
          setQrConfirming(false)
          setQrResult(undefined);
          setQrSubmiting(false);
        }}
        onSubmit={submitQrPayment}
      />
    </>
  );
}

export default CnyRecharge;
