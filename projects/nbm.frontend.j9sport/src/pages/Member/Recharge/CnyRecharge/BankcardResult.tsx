import React from 'react';
import { message, Modal } from 'antd';
import copy from "copy-to-clipboard";
import { PaymentChannel } from '../../../../apis/Payment';

function BankcardResult (
  {
    result,
    rate,
    channel,
    resultAmount,
    onCancel = () => {},
    onFinish = () => {}
  }: {
    result: any,
    rate: any,
    resultAmount?: number,
    channel: PaymentChannel,
    onCancel: () => void,
    onFinish: () => void
  }
) {
  const handleCopy = (content: string) => {
    if (copy(content)) {
      message.success(`复制成功: ${content}`);
    } else {
      message.warn('复制失败');
    }
  }

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
        Modal.warning({
          title: '为了使您的款项能更快速到账，系统已自动为您添加小数金额。请根据系统为您匹配的金额来进行充币。',
          content: (
            <p>
              充币金额：{result.collection.amount}元
              <br />
              到账金额：{resultAmount} USDT(汇率：1USDT ≈ {rate}元)
            </p>
          ),
          onOk: () => Promise.resolve()
        })
      }
    },
    [result]
  );

  return (
    <section className="bankcard-result">
      <div className="result-item">
        <label>充值方式</label>
        <span>{channel.name}</span>
      </div>
      <div className="result-item">
        <label>
          充值金额
          <var>(参考汇率: 1USDT ≈ {rate})</var>
        </label>
        <span>{result.collection.amount}</span>
      </div>
      <div className="result-item">
        <label>预计到账</label>
        <span>{resultAmount}USDT</span>
      </div>
      <div className="result-item">
        <label>汇款人姓名</label>
        <span>{result.deposit.accountName}</span>
      </div>
      <i className="hr" />
      <header>收款账户</header>
      <div className="card">
        <h3>{result.collection.bankname}</h3>
        <div className="card-no">
          <span>{result.collection.accountnumber}</span>
          <button onClick={() => handleCopy(result.collection.accountnumber)}>复制</button>
        </div>
        <div className="card-owner">
          <span>{result.collection.accountname}</span>
          <button onClick={() => handleCopy(result.collection.accountname)}>复制</button>
        </div>
      </div>
      <p>收款账户不定期更新，请于15分钟内完成转账汇款</p>
      <div className="buttons">
        <button
          className="cancel"
          onClick={onCancel}
        >重新填写</button>
        <button
          className="submit available"
          onClick={onFinish}
        >已经完成转账</button>
      </div>
    </section>
  );
}

export default BankcardResult;
