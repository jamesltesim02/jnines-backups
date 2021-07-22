import React, { useState } from 'react';
import mergeClass from "../../../utils/mergeClass";

import MemberLayout from "../../../components/member/MemberLayout";
import Recharge from "./Recharge";
import Discount from "./Discount";
import Withdraw from "./Withdraw";
import Conversion from "./Conversion/Conversion";

export enum RECORD_TYPE {
  RECHARGE,
  DISCOUNT,
  WITHDRAW,
  CONVERSION,
  CAPITAL

}

const RECORD_MENU = [
  {title: '充值记录', val: RECORD_TYPE.RECHARGE},
  // {title: '优惠记录', val: RECORD_TYPE.DISCOUNT},
  {title: '提款记录', val: RECORD_TYPE.WITHDRAW},
  {title: '转额记录', val: RECORD_TYPE.CONVERSION},
  {title: '资金明细', val: RECORD_TYPE.CAPITAL},
]

function Transaction() {
  const [recordType, setRecordType] = useState(RECORD_TYPE.RECHARGE)
  return (
    <MemberLayout
      title="交易记录"
      subTitle="WITHDRAWAL"
      className="member-table"
    >
      <header className="member-table-tit">
        {
          RECORD_MENU.map(({title, val}) => (
            <div
              key={val}
              className={mergeClass({
                'active': recordType === val
              })}
              onClick={() => setRecordType(val)}
            >
              {title}
            </div>
          ))
        }
      </header>
      <section className="member-table-content">
        {
          recordType === RECORD_TYPE.RECHARGE
          ? <Recharge />
          : recordType === RECORD_TYPE.DISCOUNT
          ? <Discount />
          : recordType === RECORD_TYPE.WITHDRAW
          ? <Withdraw />
          : recordType === RECORD_TYPE.CONVERSION || recordType === RECORD_TYPE.CAPITAL
          ? <Conversion type={recordType}/> : null
        }
      </section>
    </MemberLayout>
  );
}

export default Transaction;