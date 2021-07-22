import React from 'react';

// 充值金额列表
const AMOUNT_LIST = [
  '20',
  '100',
  '500',
  '2000',
  '5000',
  '10000'
];

function AmountList (
  {
    value,
    onChange
  } : {
    value: string,
    onChange: (amount: string) => void
  }
) {
  return (
    <div className="amount-list">
      {
        AMOUNT_LIST.map(item => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={item === value ? 'active' : undefined}
          >{item} USDT</button>
        ))
      }
    </div>
  );
}

export default AmountList;
