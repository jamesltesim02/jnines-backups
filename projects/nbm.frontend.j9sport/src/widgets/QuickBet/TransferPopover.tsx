import React from 'react';
import { message, Popover } from "antd";
import { useApi } from '../../apis';
import User from '../../apis/User';
import LoadingBar from '../../components/common/LoadingBar';
import mergeClass from '../../utils/mergeClass';

import memberStore from '../../stores/member';
import { SyncOutlined } from '@ant-design/icons';
import { CURRENCY_MAP_TEXT } from '../../consts/app';

function TransferPopover (
  {
    onFinish
  }: {
    onFinish: () => void
  }
) {
  const { user } : { user: User } = useApi({ user: User });

  const [transfering, setTransfering] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [maxAmount, setMaxAmount] = React.useState(0);
  const [amount, setAmount] = React.useState('');

  const handleTransferChange = async (visible: any) => {
    setTransfering(visible)
    if (visible && !loading) {
      try {
        setLoading(true);
        setMaxAmount(0);
        const { localBalance: availableBalance } = await user.balanceTransferToLocal();
        // const { localBalance: availableBalance } = await user.fundBalance();
        setMaxAmount(Math.floor(availableBalance));
      } finally {
        setLoading(false);
      }
    }
  }

  const available = (
    maxAmount
    &&
    amount
    &&
    !loading
    &&
    !submitting
  );

  const handleSubmit =async  () => {
    if (!available) {
      return;
    }

    try {
      setSubmitting(true);
      await user.balanceTransfer({
        amount: Number(amount),
        action:2
      });
      message.success('转额成功');
      onFinish();
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(
    () => {
      // 打开转账弹窗
      const handleTransfer = () => {
        if (!memberStore.isLoged) {
          window.dispatchEvent(new Event('j9s-quickbet-sign-request'));
          return;
        } 
        setTransfering(true);
      };
      window.addEventListener('j9s-invoke-QuickbetTransfer', handleTransfer);

      return () => {
        window.removeEventListener('j9s-invoke-QuickbetTransfer', handleTransfer);
      }
    },
    []
  );

  return (
    <Popover
      title="请输入转入额度"
      trigger="click"
      placement="bottomRight"
      visible={transfering}
      onVisibleChange={handleTransferChange}
      content={
        <div className="j9s j9s-transfer-popover">
          <header>
            可转入额度:
            <var>
              {loading ? '***.**' : maxAmount}
              &nbsp;
              {CURRENCY_MAP_TEXT[memberStore.currency]}
            </var>
            <button
              className="btn-reload"
              onClick={() => handleTransferChange(true)}
            >
              {
                loading
                ? <LoadingBar /> 
                : <SyncOutlined />
              }
            </button>
          </header>
          <section>
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
            <button onClick={() => setAmount(String(maxAmount))}>全部转入</button>
          </section>
          <footer>
            <button onClick={() => {
              setTransfering(false);
              setAmount('');
            }}>取消</button>
            <button
              onClick={handleSubmit}
              className={mergeClass({
                submit: true,
                available
              })}
            >
              {
                submitting
                ? <LoadingBar />
                : '提交'
              }
            </button>
          </footer>
        </div>
      }
    >
      <button>转入额度</button>
    </Popover>
  );
}

export default TransferPopover;