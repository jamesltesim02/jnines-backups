import React from 'react';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import mergeClass from '../../../../utils/mergeClass';

import { useApi } from '../../../../apis';
import Payment, { PaymentGenre, PaymentGenres, PaymentProtocol } from '../../../../apis/Payment';

import QrResult from './QrResult';
import RechargeFinished from './RechargeFinished';

import IconLinearUsdt from '../images/icon-linear-usdt.svg';
import RechargeStep from '../../../../components/member/Recharge/RechargeStep';
import AmountList from '../../../../components/member/Recharge/AmountList';
import ProtocolList from '../../../../components/member/Recharge/ProtocolList';
import LoadingBar from '../../../../components/common/LoadingBar';



function RechargeUsdt (
  { genre }: { genre: PaymentGenre }
) {
  const intl = useIntl();

  // 充值接口对象
  const { payment }: { payment: Payment } = useApi({ payment: Payment });

  const [submitting, setSubmiting] = React.useState(false);
  const [protocol, setProtocol] = React.useState(genre.payChannels[0].protocols[0]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [amount, setAmount] = React.useState<string>('');
  const [result, setResult] = React.useState<any>(null);

  // 提交存款
  const handleSubmit = async () => {
    if (!amount) {
      return;
    }

    // 如果是其他充值类型 则直接显示二维码
    if (genre?.code === PaymentGenres.SCAN_PAYMENT) {
      setResult({
        genre: genre?.code,
        qrCode: protocol.qrCode,
        qrCodeBase64: protocol.base64Qrcode,
        protocol: protocol.name,
        amount
      });
      setCurrentStep(1);
      return;
    }

    setSubmiting(true);
    payment.dcBox({
      payId: protocol.payId as string,
      virtualAmount: Number(amount),
      rate: genre.rate as  number
    }).then(result => {
      setResult(result);
      setCurrentStep(1);
    }).finally(
      () => setSubmiting(false)
    );
  };

  let contentComp = null;

  React.useEffect(
    () => {
      setCurrentStep(0);
    },
    [genre]
  );

  if (currentStep === 2) {
    contentComp = (<RechargeFinished />);
  } else if (currentStep === 1) {
    contentComp = (
      <QrResult
        result={result}
        onCancel={() => {
          setResult(null);
          setCurrentStep(0);
        }}
        onFinish={() => setCurrentStep(2)}
      />
    );
  } else {
    contentComp = (
      <>
        <section className="amount">
          {
            (
              genre
              &&
              genre.code === PaymentGenres.SCAN_PAYMENT
            ) ? (
              <>
                <label>选择协议</label>
                <ProtocolList
                  protocols={genre.payChannels[0].protocols}
                  current={protocol}
                  onChange={setProtocol}
                />
              </>
            ) : null
          }
          {/* TODO 汇率从查询结果取 */}
          <label>充值金额 <span>(参考汇率 1USDT≈¥{genre.rate})</span></label>
          <AmountList
            value={amount}
            onChange={setAmount}
          />
          <div className="input-text">
            <img src={IconLinearUsdt} />
            <span>
              <input
                type="text"
                value={amount}
                placeholder="请输入充值金额，或在上方选择"
                onChange={
                  ({ target: { value } }) => {
                    const newValue = value.replace(/\D+/g, '');
                    setAmount(
                      newValue === '0'
                      ? ''
                      : newValue
                    );
                  }
                }
              />
            </span>
            <label>USDT</label>
          </div>
        </section>
        <button
          className={mergeClass({
            submit: true,
            'full-single-submit': true,
            available: Number(amount) > 0 && !submitting
          })}
          onClick={
            submitting
            ? undefined
            : handleSubmit
          }
        >
          {
            submitting
            ? <LoadingBar />
            : '确认提交'
          }
        </button>
      </>
    );
  }

  return (
    <div className="recharege-content recharge-usdt">
      <RechargeStep
        steps={[
          '填入充值金额',
          '获取收款地址并转账',
          '等待充值到账'
        ]}
        current={currentStep}
      />
      {contentComp}
    </div>
  );
}

export default RechargeUsdt;
