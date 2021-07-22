import React from 'react';
import { SwapOutlined, SyncOutlined } from '@ant-design/icons';


import User, { Balance } from '../../../../apis/User';
import Dialog from '../../Dialog';

import OnlineCustomerService from '../../../common/OnlineCustomerService';
import mergeClass from '../../../../utils/mergeClass';
import { message } from 'antd';
import { useApi } from '../../../../apis';
import LoadingBar from '../../../common/LoadingBar';
import { MEMBER_RELOAD_EVENT } from '../../../../consts/app';

function CreditTransferDialog (
  {
    open,
    onClose,
    onFinish,
    balance
  }: {
    open: boolean,
    onClose: () => void,
    onFinish: () => void,
    balance: Balance
  }
) {

  const { user } : { user: User } = useApi({ user: User });

  const [loading, setLoading] = React.useState(false);
  const [transfering, setTransfering] = React.useState(false);
  const [toJ9Sport, setToJ9Sport] = React.useState(true);
  const [amount, setAmount] = React.useState('');
  const [j9Balance, setJ9Balance] = React.useState(0);

  const loadJ9Balance = async () => {
    if (transfering || loading) {
      return;
    }
    try {
      setLoading(true);
      const { localBalance: availableBalance } = await user.balanceTransferToLocal();
      setJ9Balance(Math.floor(availableBalance));
      // setJ9Balance(Math.floor(balance?.localBalance));
    } finally {
      setLoading(false);
    }
  }

  const handleTransfer = async () => {
    if (
      Number(amount) === 0
      ||
      transfering
    ) {
      return;
    }
    try {
      setTransfering(true);
      await user.balanceTransfer({
        amount: Number(amount),
        action: toJ9Sport ? 2 : 1
      });
      message.success('转额成功');
      onFinish();
      setAmount('');
      setToJ9Sport(true);
      // 重新查询额度
      window.dispatchEvent(new Event(MEMBER_RELOAD_EVENT));
    } finally {
      setTransfering(false);
    }
  };

  const [
    sportBalance,
  ] = [
    balance?.withdrawableBalance || 0,
  ];

  const maxTransferAmount = Math.floor(toJ9Sport ? j9Balance : sportBalance);

  const j9BalanceItem = (
    <div className="balance-item">
      <label>
        {toJ9Sport ? '从' : '转到'}
        <b>九游会</b>
      </label>
      <div>
        <span>可转额度：</span>
        <var>
          {
            loading
            ? '***.**'
            : j9Balance
          }
        </var>
        <button
          className="btn-reload"
          onClick={loadJ9Balance}
        >
          {
            loading
            ? <LoadingBar /> 
            : <SyncOutlined />
          }
        </button>
      </div>
    </div>
  );

  const sportBalanceItem = (
    <div className="balance-item">
      <label>
        {!toJ9Sport ? '从' : '转到'}
        <b>九游体育</b>
      </label>
      <div>
        <span>可转额度：</span>
        <var>{sportBalance}</var>
      </div>
    </div>
  );

  React.useEffect(
    () => {
      if (open) {
        loadJ9Balance();
      }
    },
    [open]
  );

  return (
    <Dialog
      open={open}
      className="credit-transfer-dialog"
      onClose={onClose}
      closeButton
      imgbg
    >
      <header>额度转换</header>
      {
        toJ9Sport
        ? j9BalanceItem
        : sportBalanceItem
      }
      <div className="swaper">
        <button onClick={() => setToJ9Sport(!toJ9Sport)}>
          <SwapOutlined />
        </button>
      </div>
      {
        !toJ9Sport
        ? j9BalanceItem
        : sportBalanceItem
      }
      <div className="amount">
        <span className="label">
          <span>* 转入金额</span>
          <button onClick={() => setAmount(String(maxTransferAmount))}>全部转入</button>
        </span>
        <div>
          <span className="input">
            <input
              type="text"
              placeholder="请输入转入金额"
              value={amount}
              onChange={({ target: { value } }) => {
                let newValue = value.replace(/\D|^0+/gi, '');
                if (Number(newValue) > maxTransferAmount) {
                  newValue = String(maxTransferAmount);
                }
                setAmount(newValue);
              }}
            />
          </span>
          <span>USDT</span>
        </div>
      </div>
      <div className="buttons">
        <button
          className={mergeClass(
            'submit',
            'full-single-submit',
            (
              Number(amount) > 0
              &&
              !transfering
            ) ? 'available' : undefined
          )}
          onClick={handleTransfer}
        >
          {
            transfering
            ? <LoadingBar />
            : '确定'
          }
        </button>
      </div>
      <div className="online-cs">
        <OnlineCustomerService>
          遇到问题了吗?联系<b>在线客服</b>
        </OnlineCustomerService>
      </div>
    </Dialog>
  );
}

export default CreditTransferDialog;
