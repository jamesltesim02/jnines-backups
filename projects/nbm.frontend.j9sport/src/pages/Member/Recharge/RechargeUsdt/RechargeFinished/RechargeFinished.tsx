import React from 'react';
import { useHistory } from 'react-router';
import IconHourglass from '../../images/icon-hour-glass.svg';

function RechargeFinished () {
  const history = useHistory();

  return (
    <section className="recharge-finished">
      <img src={IconHourglass} />
      <div className="tips1">正在处理充值请求...</div>
      <div className="tips2">若完成支付通常5分钟内快速到账</div>
      <button onClick={() => {
        history.push('/member/amount-records');
      }}>交易记录</button>
    </section>
  );
}

export default RechargeFinished;
