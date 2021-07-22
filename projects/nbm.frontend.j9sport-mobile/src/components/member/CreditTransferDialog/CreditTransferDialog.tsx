import { Toast } from 'antd-mobile';
import React from 'react';
import { useApi } from '../../../apis';
import User, { Balance } from '../../../apis/User';

import Dialog from '../Dialog';
import OnlineCustomerService from '../../common/OnlineCustomerService';

import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../common/LoadingBar';

import IconReload from '../../../pages/Tabs/Member/img/icon-reload.svg';

function CreditTransferDialog (
  {
    open,
    onClose,
    onFinish,
    balance,
  }: {
    open: boolean,
    onClose: () => void,
    onFinish: () => void,
    balance: Balance,
    fromInit?: boolean
  }
) {

  const { user } : { user: User } = useApi({ user: User });

  const [loading, setLoading] = React.useState(false);
  const [toJ9Sport, setToJ9Sport] = React.useState(true);
  const [amount, setAmount] = React.useState('');
  const [transfering, setTransfering] = React.useState(false);
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
      Toast.success('转额成功');
      onFinish();
      setAmount('');
      setToJ9Sport(true);
    } finally {
      setTransfering(false);
    }
  };

  const sportBalance = balance?.withdrawableBalance || 0;
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
            ? <LoadingBar size="xxs" /> 
            : <img src={IconReload} />
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
      closeButton
      className="credit-transfer-dialog"
      onClose={onClose}
    >
      <header>额度转换</header>
      {
        toJ9Sport
        ? j9BalanceItem
        : sportBalanceItem
      }
      <div className="swaper">
        <button onClick={() => setToJ9Sport(!toJ9Sport)}>
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="swap"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
          </svg>
        </button>
      </div>
      {
        !toJ9Sport
        ? j9BalanceItem
        : sportBalanceItem
      }
      <div className="amount">
        <label>
          <span>* 转入金额</span>
          <button onClick={() => setAmount(String(maxTransferAmount))}>全部转入</button>
        </label>
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
      <OnlineCustomerService className="helper" />
    </Dialog>
  );
}

export default CreditTransferDialog;
