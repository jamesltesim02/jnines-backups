import { Icon, Picker } from 'antd-mobile';
import React from 'react';
import { useApi } from '../../../apis';
import Wallet from '../../../apis/Wallet';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../common/LoadingBar';
import AccountName from './AccountName';

const BANK_ACCOUNT_TYPES = [
  {
    label: '借记卡',
    value: 'DEBIT'
  }
];

function Bankcard (
  {
    accountName: name = '',
    onFinish
  } : {
    accountName?: string,
    onFinish: () => void
  }
) {
  const { wallet } : { wallet: Wallet } = useApi({ wallet: Wallet })
  const [banks, setBanks] = React.useState<Array<{ label: string, value: string }>>([]);
  const [provinces, setProvinces] = React.useState<Array<{
    label: string,
    value: string,
    children: Array<{ label: string, value: string}>
  }>>([]);

  const [bank, setBank] = React.useState<string>('');
  const [province, setProvince] = React.useState<string>('');
  const [bankCity, setBankCity] = React.useState<string>('');
  const [bankAccountNo, setBankAccountNo] = React.useState('');
  const [bankAccountName, setBankAccountName] = React.useState(name || '');
  const [bankAccountType, setBankAccountType] = React.useState<string>(BANK_ACCOUNT_TYPES[0].value);
  const [branchName, setBranchName] = React.useState<string>('');

  const [adding, setAdding] = React.useState(false);

  // 是否可以提交
  const submitable = (
    (
      bankAccountNo.length >= 16
      &&
      bankAccountNo.length <= 19
    )
    &&
    branchName
  );

  // 提交添加银行卡请求
  const handleSubmit = async () => {
    if (!submitable) {
      return;
    }

    try {
      setAdding(true);
      await wallet.addBankcard({
        bankAccountName,
        bankAccountNo,
        bankAccountType,
        bankCity,
        bankCountry: province,
        bankName: bank,
        branchName
      });
      onFinish();
    } finally {
      setAdding(false);
    }
  };

  // 自动查询银行和省份
  React.useEffect(
    () => {
      wallet.bankList().then(({ bankNames, provinces }) => {
        setBanks(bankNames.map((b: string) => ({ label: b, value: b })));
        setProvinces(
          provinces.map((p: string) => ({ label: p, value: p, children: [] }))
        );

        setBank(bankNames[0]);
        setProvince(provinces[0]);
      });
    },
    [wallet]
  );

  // 根据省份查询城市
  React.useEffect(
    () => {
      const provinceObj = provinces.find(({ value }) => value === province);
      if (!provinceObj || provinceObj?.children.length) {
        return;
      }

      wallet.district(province).then(result => {
        provinceObj.children = result.map((c: string) => ({ label: c, value: c }));
        setProvinces([ ...provinces ]);
        setBankCity(result[0]);
      })
    },
    [province]
  )

  return (
    <>
      <header>添加银行卡</header>
      <p>请填写信息以确保成功转账</p>
      <AccountName
        value={bankAccountName}
        readonly={Boolean(name)}
        onChange={value => setBankAccountName(value)}
      />
      <div className="input-field">
        <label>银行卡号</label>
        <span>
          <input
            type="text"
            maxLength={19}
            value={bankAccountNo}
            onChange={({ target: { value } }) => setBankAccountNo(value.replace(/\D+/g, ''))}
            placeholder="请填写与您姓名一致的卡号"
          />
        </span>
      </div>
      <Picker
        data={banks}
        cols={1}
        value={[bank]}
        onChange={(value: any) => setBank(value[0] || value)}
      >
        <div className="input-field">
          <label>所属银行<button>?</button></label>
          <span>{bank}<Icon type="down" /></span>
        </div>
      </Picker>
      <Picker
        data={BANK_ACCOUNT_TYPES}
        cols={1}
        value={[bankAccountType]}
        onChange={(value: any) => setBankAccountType(value[0] || value)}
      >
        <div className="input-field">
          <label>账号类型</label>
          <span>
            {
              BANK_ACCOUNT_TYPES.find(
                ({ value }) => value === bankAccountType
              )?.label
            }
            <Icon type="down" />
          </span>
        </div>
      </Picker>
      <Picker
        data={provinces}
        cols={2}
        value={[province, bankCity]}
        onChange={(values: any) => {
          setProvince(values[0]);
          setBankCity(values[1]);
        }}
        onPickerChange={(values: any) => {
          setProvince(values[0]);
        }}
      >
        <div className="input-field">
          <label>开户省/市</label>
          <span>{province}, {bankCity}<Icon type="down" /></span>
        </div>
      </Picker>
      <div className="input-field">
        <label>开户网点</label>
        <span>
          <input
            type="text"
            value={branchName}
            onChange={({ target: { value } }) => setBranchName(value)}
          />
        </span>
      </div>
      <button
        className={mergeClass({
          submit: true,
          available: (!adding && submitable)
        })}
        onClick={handleSubmit}
      >{adding ? (<LoadingBar />) : '添加'}</button>
    </>
  );
}

export default Bankcard;
