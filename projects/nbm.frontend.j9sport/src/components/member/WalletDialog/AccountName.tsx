import React from 'react';
import mergeClass from '../../../utils/mergeClass';
import OnlineCustomerService from '../../common/OnlineCustomerService';

function AccountName (
  {
    value,
    readOnly,
    onChange = () => {}
  } : {
    value?: string,
    readOnly?: boolean,
    onChange: (newValue: string) => void
  }
) {
  return (
    <div
      className={mergeClass(
        'input-field',
        'account-name'
      )}
    >
      <label>
        <b>*</b>账户姓名: 
        <span>
          {
            readOnly ? (
              <OnlineCustomerService className="account-name-tips">
                如果需要修改姓名,联系<b>在线客服</b>
              </OnlineCustomerService>
            ) : (
              <div className="account-name-tips">
                绑定后无法修改姓名，请填写您的真实姓名
              </div>
            )
          }
        </span>
      </label>
      <div>
        <input
          value={value}
          onChange={({ target: { value } }) => onChange(value)}
          placeholder="请填写真实姓名"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

export default AccountName;
