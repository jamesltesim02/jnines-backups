import { Icon, Picker } from 'antd-mobile';
import React from 'react';
import { useApi } from '../../../apis';
import Wallet from '../../../apis/Wallet';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../common/LoadingBar';
import AccountName from './AccountName';

function Usdt (
  {
    virtualWalletInfo,
    accountName: name = '',
    onFinish
  } : {
    virtualWalletInfo: any,
    accountName: string,
    onFinish: () => void
  }
) {

  const { wallet } : { wallet: Wallet } = useApi({ wallet: Wallet });

  const [accountName, setAccountName] = React.useState(name);
  const [currentType, setCurrentType] = React.useState(virtualWalletInfo[0]);
  const [currentProtocol, setCurrentProtocol] = React.useState(virtualWalletInfo[0].protocolList[0].protocol);
  const [accountNo, setAccountNo] = React.useState('');

  const [adding, setAdding] = React.useState(false);

  // 提交事件
  const handleSubmit = async () => {
    if (adding || !accountName || !accountNo) {
      return;
    }

    try {
      setAdding(true);
      await wallet.addVirtual({
        accountName,
        walletType: currentType.code,
        protocol: currentProtocol,
        currency: 'USDT',
        accountNo
      });
      onFinish();
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <header>添加USDT钱包</header>
      <AccountName
        value={accountName}
        readonly={Boolean(name)}
        onChange={setAccountName}
      />
      <Picker
        data={
          virtualWalletInfo.map(
            (item: any) => ({
              label: item.walletName,
              value: item
            })
          )
        }
        cols={1}
        value={[currentType]}
        onChange={(value: any) => {
          setCurrentType(value[0]);
          setCurrentProtocol(value[0].protocolList[0].protocol);
        }}
      >
        <div className="input-field">
          <label>钱包类型</label>
          <span>{currentType.walletName}<Icon type="down" /></span>
        </div>
      </Picker>
      <Picker
        data={
          currentType.protocolList.map((item: any) => ({
            label: item.protocol,
            value: item.protocol
          }))
        }
        cols={1}
        value={[currentType]}
        onChange={(value: any) => setCurrentProtocol(value[0] || value)}
      >
        <div className="input-field">
          <label>钱包协议<button>?</button></label>
          <span>{currentProtocol}<Icon type="down" /></span>
        </div>
      </Picker>
      <div className="input-field">
        <label>钱包地址</label>
        <span>
          <input
            type="text"
            placeholder="请输入您的USDT钱包地址"
            value={accountNo}
            onChange={({ target: { value }}) => setAccountNo(value)}
          />
        </span>
      </div>
      <button
        className={mergeClass({
          submit: true,
          available: (!adding && accountName && accountNo)
        })}
        onClick={handleSubmit}
      >
        {adding ? <LoadingBar /> : '添加'}
      </button>
    </>
  );
}

export default Usdt;
