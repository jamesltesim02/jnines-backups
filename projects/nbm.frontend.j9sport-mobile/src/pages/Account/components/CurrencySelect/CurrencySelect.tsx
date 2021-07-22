import React from 'react';
import { observer } from "mobx-react";

function CurrencySelect(
  {
    onChange
  }: {
    onChange?: any
  }
) {
  return (
      <div className="currency-select">
        货币类型
        <select
          onChange={onChange}
        >
          <option value={2}>USDT(1:1)</option>
          <option value={1}>CNY(1:7)</option>
        </select>
      </div>
  );
}

export default observer(CurrencySelect);