import React,{useState} from 'react';
import mergeClass from "../../utils/mergeClass";
import { Icon } from "antd-mobile";

import Recharge from "./Recharge";
import Discount from "./Discount";
import Withdraw from "./Withdraw";
import Conversion from "./Conversion/Conversion";

export enum RECORD_TYPE {
  RECHARGE,
  DISCOUNT,
  WITHDRAW,
  CONVERSION,
}

const RECORD_MENU = [
  {title: '充值记录', val: RECORD_TYPE.RECHARGE},
  // {title: '优惠记录', val: RECORD_TYPE.DISCOUNT},
  {title: '提款记录', val: RECORD_TYPE.WITHDRAW},
  {title: '转额记录', val: RECORD_TYPE.CONVERSION},
]

function Transaction() {
  const [recordType, setRecordType] = useState(RECORD_TYPE.RECHARGE)
  return (
    <div
      className="transaction"
    >
      <div className="pages-bar">
        <button onClick={() => window.history.back()}>
          <Icon type="left"/>
        </button>
        <div>交易记录</div>
      </div>
      <div className="transaction-type">
        {
          RECORD_MENU.map(({title, val}) => (
            <span
              key={val}
              className={mergeClass({
                'selected': recordType === val
              })}
              onClick={() => setRecordType(val)}
            >
              {title}
            </span>
          ))
        }
      </div>
      {
        recordType === RECORD_TYPE.RECHARGE
        ? <Recharge />
        : recordType === RECORD_TYPE.DISCOUNT
        ? <Discount />
        : recordType === RECORD_TYPE.WITHDRAW
        ? <Withdraw />
        : <Conversion />
      }
    </div>
  );
}

export default Transaction;