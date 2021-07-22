import { Select } from 'antd';
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
  const [currentType, setCurrentType] = React.useState(virtualWalletInfo[0].code);
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
        walletType: currentType,
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
        readOnly={Boolean(name)}
        onChange={setAccountName}
      />
      <div className="input-field select-field">
        <label>钱包类型</label>
        <div>
          <Select
            onChange={(value: string) => setCurrentType(value)}
            value={currentType}
          >
            {
              virtualWalletInfo.map((item: any) => (
                <Select.Option value={String(item.code)}>
                  {item.walletName}
                </Select.Option>
              ))
            }
          </Select>
        </div>
      </div>
      <div className="input-field select-field">
        <label>钱包协议</label>
        <div>
          <Select
            onChange={(value: string) => setCurrentProtocol(value)}
          >
            {
              virtualWalletInfo.find(
                (item: any) => item.code === currentType
              ).protocolList.map((item: any) => (
                <Select.Option value={String(item.protocol)}>
                  {item.protocol}
                </Select.Option>
              ))
            }
          </Select>
        </div>
      </div>
      <div className="input-field">
        <label>钱包地址</label>
        <div>
          <input
            type="text"
            placeholder="请输入您的USDT钱包地址"
            value={accountNo}
            onChange={({ target: { value }}) => setAccountNo(value)}
          />
        </div>
      </div>
      <button
        className={mergeClass({
          submit: true,
          'full-single-submit': true,
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
