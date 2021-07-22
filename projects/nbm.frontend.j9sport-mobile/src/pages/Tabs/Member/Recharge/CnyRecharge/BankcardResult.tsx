import { Toast } from 'antd-mobile/es';
import React from 'react';
import copy from "copy-to-clipboard";

import RechargeFinished from '../RechargeFinished';
import J9Button from '../../../../../components/common/J9Button';
import { PaymentChannel } from '../../../../../apis/Payment';
import { Modal } from 'antd-mobile';

function BankcardResult (
  {
    result,
    rate,
    channel,
    resultAmount,
    onCancel = () => {},
  }: {
    result: any,
    rate: any,
    resultAmount?: number,
    channel: PaymentChannel,
    onCancel: () => void
  }
) {
  const [finished, setFinished] = React.useState(false);

  React.useEffect(
    () => {
      if (
        [
          // 支付宝
          '2',
          // 微信
          '3'
        ].includes(channel.payType)
        &&
        result.collection.amount % 1 > 0
      ) {
        Modal.alert(
          '为了使您的款项能更快速到账，系统已自动为您添加小数金额。请根据系统为您匹配的金额来进行充币。',
          (
            <p style={{ textAlign: 'left' }}>
              充币金额：{result.collection.amount}元
              <br />
              到账金额：{resultAmount} USDT(汇率：1USDT ≈ {rate}元)
            </p>
          ),
          [{text: '我知道了' }]
        );
      }
    },
    [result]
  );

  if (finished) {
    return <RechargeFinished />;
  }

  const handleCopy = (content: string) => {
    if (copy(content)) {
      Toast.success(`复制成功: ${content}`);
    } else {
      Toast.fail('复制失败');
    }
  }


  return (
    <section className="bankcard-result">
      <div className="deposit">
        <div className="amount">
          <label>充值金额<var>(参考汇率: 1USDT ≈ {rate})</var></label>
          <span>{result.collection.amount}</span>
        </div>
        <div className="amount-tip">
          预计到账: {resultAmount}USDT,实际按收款汇率计算
        </div>
        <div className="receiver">
          <label>汇款人姓名</label>
          <span>{result.deposit.accountName}</span>
        </div>
      </div>
      <div className="card">
        <header>收款账户</header>
        <div className="account-number">
          <span>{result.collection.accountnumber}</span>
          <button onClick={() => handleCopy(result.collection.accountnumber)}>复制</button>
        </div>
        <div className="account-name">
          <span>{result.collection.accountname}</span>
          <button onClick={() => handleCopy(result.collection.accountname)}>复制</button>
        </div>
        <div className="bank-name"><span>{result.collection.bankname}</span></div>
        <p>收款账户不定时更新，请于15分钟内完成转账汇款</p>
      </div>
      <div className="tips-bar tips">
        务必按照上方显示金额转账，否则充值无法到账
      </div>
      <div className="oprs">
        <J9Button
          onClick={onCancel}
        >重新填写</J9Button>
        <J9Button
          submit
          available
          onClick={() => setFinished(true)}
        >已经完成转账</J9Button>
      </div>
    </section>
  );
}

export default BankcardResult;
