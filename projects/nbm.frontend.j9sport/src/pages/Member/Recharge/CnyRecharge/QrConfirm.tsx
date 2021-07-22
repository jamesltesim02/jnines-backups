import React from 'react';
import { useHistory } from 'react-router';
import { PaymentChannel } from '../../../../apis/Payment';
import LoadingBar from '../../../../components/common/LoadingBar';
import Dialog from '../../../../components/member/Dialog';

function QrConfirm (
  {
    open,
    channel,
    amount,
    feeAmount,
    resultAmount,
    rate,
    result,
    qrSubmiting,
    onClose,
    onSubmit
  }: {
    open: boolean,
    channel?: PaymentChannel,
    rate: number
    amount: number,
    feeAmount: number,
    resultAmount: number,
    result: any,
    qrSubmiting: boolean,
    onClose: () => void,
    onSubmit: () => void
  }
) {
  const history = useHistory();

  // 请打开支付宝完成支付
  return (
    <Dialog
      open={open}
      className="qr-confirm-dialog"
      closeButton
      onClose={onClose}
    >
      {
        result ? (
          <>
            <header>请打开支付宝完成支付</header>
            <section className="qr-result-item">
              <label>订单号</label>
              <span>{result.billno}</span>
            </section>
            <section className="qr-result-item">
              <label>充值金额</label>
              <span>金额{amount}元≈{resultAmount}USDT</span>
            </section>
            <footer>
              <button
                className="btn-cancel"
                onClick={onClose}
              >重新支付</button>
              <button
                className="btn-submit"
                onClick={() => history.push('/member/amount-records')}
              >已完成支付</button>
            </footer>
          </>
        ) : (
          <>
            <header>您已经选择{channel?.name}</header>
            <section>
              <div>
                <label>充值金额</label>
                <span>{amount}元</span>
              </div>
              <div>
                <label>手续费</label>
                <span>{feeAmount}元</span>
              </div>
              <div>
                <label>参考汇率</label>
                <span>{rate}</span>
              </div>
              <div>
                <label>预计到账</label>
                <span>{resultAmount}USDT</span>
              </div>
            </section>
            <footer>
              <button
                className="btn-cancel"
                onClick={onClose}
              >重新选择</button>
              <button
                className={
                  qrSubmiting
                  ? 'btn-cancel'
                  : 'btn-submit'
                }
                onClick={onSubmit}
              >
                {
                  qrSubmiting
                  ? <LoadingBar />
                  : '确认充值'
                }
              </button>
            </footer>
          </>
        )
      }
    </Dialog>
  );
}

export default QrConfirm;
