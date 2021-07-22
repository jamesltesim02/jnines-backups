// import { Toast } from 'antd-mobile';
import React from 'react';
import { useApi } from '../../apis';
import User from '../../apis/User';
import J9Button from '../../components/common/J9Button';
import LoadingBar from '../../components/common/LoadingBar';
import { CURRENCY_TEXT } from '../../consts/app';
import memberStore from '../../stores/member';
import QuickBetDialog from '../common/QuickDialog';

function TransferDialog(
  {
    open,
    onClose,
    onFinish
  }: {
    open: boolean,
    onClose: () => void,
    onFinish: () => void
  }
) {

  const { user }: { user: User } = useApi({ user: User });

  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [maxAmount, setMaxAmount] = React.useState(0);
  const [amount, setAmount] = React.useState('');

  const invalid = (
    !maxAmount
    ||
    !amount
    ||
    loading
    ||
    submitting
  )

  const loadBalance = async () => {
    try {
      setLoading(true);
      setMaxAmount(0);
      const { localBalance: availableBalance } = await user.balanceTransferToLocal();
      // const { localBalance: availableBalance } = await user.fundBalance();
      setMaxAmount(Math.floor(availableBalance));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (invalid) {
      return;
    }

    try {
      setSubmitting(true);
      await user.balanceTransfer({
        amount: Number(amount),
        action: 2
      });
      // TODO Toast.success('转额成功');
      onFinish();
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(
    () => {
      if (!open) {
        return;
      }
      loadBalance();
    },
    [open, user]
  );

  return (
    <QuickBetDialog
      open={open}
      className="j9s-transfer-dialog"
      onClose={onClose}
      closeButton
      unmountOnExit
    >
      <header>转入额度</header>
      <div className="j9s-amount">
        <section>
          <span>
            * 可转入额度:
            <var>
              {loading ? '***.**' : maxAmount}
              &nbsp;
              {CURRENCY_TEXT[memberStore.currency]}
            </var>
          </span>
          <button onClick={loadBalance}>
            {
              loading
                ? <LoadingBar size="xxs" />
                : (
                  <svg viewBox="64 64 896 896" focusable="false" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z"></path></svg>
                )
            }
          </button>
        </section>
        <div>
          <span className="j9s-input">
            <input
              type="text"
              placeholder="请输入转入金额"
              value={amount}
              onChange={({ target: { value } }) => {
                let newValue = value.replace(/\D|^0+/gi, '');
                if (Number(newValue) > maxAmount) {
                  newValue = String(maxAmount);
                }
                setAmount(newValue);
              }}
            />
          </span>
          <button onClick={() => setAmount(String(Math.floor(maxAmount)))}>
            全部转入
          </button>
        </div>
      </div>
      <div className="j9s-submit">
        <J9Button
          submit
          loading={submitting}
          available={!invalid}
          onClick={handleSubmit}
        >提交</J9Button>
      </div>
    </QuickBetDialog>
  )
}

export default TransferDialog;
