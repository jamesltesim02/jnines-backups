import React from 'react';

import { useApi } from '../../../../apis';
import Payment, { PaymentChannel, PaymentGenre, PaymentGenres } from '../../../../apis/Payment';

// import IconAlipay from './images/icon-alipay.svg';
// import IconWechatpay from './images/icon-wechatpay.svg';
// import IconBankcard from './images/icon-bankcard.svg';
import IconLinearRmb from './images/icon-linear-rmb.svg';
import RechargeStep from '../../../../components/member/Recharge/RechargeStep';
import mergeClass from '../../../../utils/mergeClass';
import QrConfirm from './QrConfirm';
import BankcardResult from './BankcardResult';
import RechargeFinished from '../RechargeFinished';

import UnavailableImage from './images/recharge-need-cny-role@2x.png';
import MaintainImage from './images/maintain.png';
import LoadingBar from '../../../../components/common/LoadingBar';
import { scanqrPaymentSync } from '../../../../apis/SyncApi';

/** 充值类别名称 */
const GENRE_NAMES: Record<string, string> = {
  [PaymentGenres.BANK_CARD]: '人民币充值',
  [PaymentGenres.ALIPAY]: '支付宝支付'
};

/** 充值类别图标 */
const GENRE_ICONS: Record<string, JSX.Element>= {
  // [PaymentGenres.BANK_CARD]: <IconAlipayChannel />,
  // [PaymentGenres.ALIPAY]: <IconBankcardChannel />
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
// const AMOUNT_CLEANNER_PATTERN = /([^\.\d]+)|((?<=\..*)\.)|((?<=\..{2}).)/g;

function CnyRecharge (
  {
    genre
  }: {
    genre: PaymentGenre
  }
) {
  const { payment }: { payment: Payment } = useApi({ payment: Payment });

  const [submiting, setSubmiting] = React.useState(false);
  const [qrSubmiting, setQrSubmiting] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
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
      genre.code != PaymentGenres.BANK_CARD
      ||
      Boolean(depositor)
    )
  );

  const feeAmount = (+amount * Number(currentChannel?.fee) / 100) || 0;
  const resultAmount = Math.floor(((+amount - feeAmount) / genre.rate) * 100) / 100;

  // 人民币充值 (银行卡转账)
  const handleBankcardSubmit = async () => {
    if (!amountValid) {
      return;
    }
    setSubmiting(true);
    try {
      // 提交转账提案请求
      const result = await payment.bankpay({
        accountName: depositor,
        amount: Number(amount),
        payType: Number(currentChannel?.payType)
      });
      setBankcardResult(result);
      setCurrentStep(1);
    } finally {
      setSubmiting(false);
    }
  };

  // 提交扫码支付
  const submitQrPayment = async () => {
    setQrSubmiting(true);
    try {
      // const result = await payment.scanqr({
      const result = scanqrPaymentSync({
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
      setCurrentStep(2);
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
    setCurrentStep(1);
  }

  // 修改支付类别时重置到新类别到第一个渠道
  React.useEffect(
    () => {
      const channel = genre?.payChannels[0];
      setCurrentChannel(channel);
      setCurrentStep(0);
      // 重置金额
      if (
        genre?.code === PaymentGenres.ALIPAY
        &&
        channel?.amountList?.findIndex(a => String(a) === amount) === -1
      ) {
        setAmount(String((channel.amountList as string[])[0]));
      }
    },
    [genre, setCurrentChannel, setAmount]
  );

  //  当前渠道不可用
  if (genre.status === -1) {
    return (
      <div className="recharege-content cny-recharge unavailable">
        <div className="image">
          <img src={UnavailableImage} />
        </div>
        <p>该渠道为贵宾专享，您还没有权限</p>
        <p>升级到<b>翡翠卡及以上</b>，可联系客服申请人民币渠道</p>
      </div>
    );
  }

  if (!genre.payChannels?.length) {
    return (
      <div className="recharege-content cny-recharge unavailable">
        <div className="image">
          <img src={MaintainImage} />
        </div>
        <p>该渠道维护中，请使用其它渠道充值</p>
      </div>
    );
  }

  let rechargeComp = null;

  if (
    genre.code === PaymentGenres.ALIPAY
    ||
    (
      currentStep === 0
      &&
      genre.code === PaymentGenres.BANK_CARD
    )
  ) {
    rechargeComp = (
      <>
        <label>选择类型</label>
        <div className="channels">
          {
            genre.payChannels.map(channel => (
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
        <label>
          充值金额
          <span>(当前汇率：1USDT≈{Number(genre.rate).toFixed(2)}CNY)</span>
        </label>
        {
          genre.code === PaymentGenres.BANK_CARD ? (
            <>
              <div className="input-text">
                <img src={IconLinearRmb} />
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
              {/* <p className="bankcard-tips">
                建议存入特殊金额，款项能快速充值到您的账户<br />
                例：5659.20、1733.56、778.78
              </p> */}
            </>
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
          <var>
            {resultAmount} USDT
          </var>
        </div>
        {
          genre.code === PaymentGenres.BANK_CARD ? (
            <>
              <label>汇款人姓名</label>
              <div className="input-text">
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
        {/* TODO PC 按钮可点击逻辑判断 */}
        <div className="buttons">
          <button
            className={
              mergeClass(
                'submit',
                'full-single-submit',
                (
                  amountValid
                  &&
                  !submiting
                ) ? 'available' : undefined
              )
            }
            onClick={
              (
                !amountValid
                ||
                submiting
              ) ? undefined
              : (
                genre.code === PaymentGenres.BANK_CARD
                ? handleBankcardSubmit
                : handleQRSubmit
              )
            }
          >
            {
              submiting
              ? <LoadingBar />
              : '确认提交'
            }
          </button>
        </div>
      </>
    );
  }

  if (genre.code === PaymentGenres.BANK_CARD) {
    if (currentStep === 1) {
      // 银行卡转账提交成功提示界面
      rechargeComp = (
        <BankcardResult
          rate={Number(genre.rate).toFixed(2)}
          result={bankcardResult}
          channel={currentChannel as PaymentChannel}
          resultAmount={resultAmount}
          onCancel={() => {
            setBankcardResult(undefined);
            setCurrentStep(0);
          }}
          onFinish={() => setCurrentStep(2)}
        />
      );
    } else if (currentStep === 2) {
      rechargeComp = <RechargeFinished />;
    }
  }

  return (
    <>
      <section className="recharege-content cny-recharge">
        <RechargeStep
          steps={[
            '填入充值金额',
            '获取收款地址并转账',
            '等待充值到账'
          ]}
          current={currentStep}
        />
        {rechargeComp}
      </section>
      <QrConfirm
        open={qrConfirming}
        channel={currentChannel}
        amount={+amount}
        feeAmount={feeAmount}
        resultAmount={resultAmount}
        rate={genre.rate}
        result={qrResult}
        qrSubmiting={qrSubmiting}
        onClose={() => {
          setQrConfirming(false)
          setQrResult(undefined);
          setCurrentStep(0);
        }}
        onSubmit={submitQrPayment}
      />
    </>
  );
}

export default CnyRecharge;
