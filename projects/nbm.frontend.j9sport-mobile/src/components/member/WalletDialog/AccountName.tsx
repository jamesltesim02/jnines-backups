import React from 'react';
import mergeClass from '../../../utils/mergeClass';
import OnlineCustomerService from '../../common/OnlineCustomerService';

function AccountName (
  {
    value,
    readonly,
    onChange = () => {}
  } : {
    value?: string,
    readonly?: boolean,
    onChange: (newValue: string) => void
  }
) {
  return (
    <>
      <div
        className={mergeClass({
          'account-name': true,
          'input-field': !readonly
        })}
      >
        <label>账户姓名: </label>
        <span>
          {
            readonly
            ? value
            : (
              <input
                value={value}
                onChange={({ target: { value } }) => onChange(value)}
                placeholder="请填写真实姓名"
              />
            )
          }
        </span>
      </div>
      {
        readonly ? (
          <OnlineCustomerService className="account-name-tips" />
        ) : (
          <div className="account-name-tips">
            绑定后无法修改姓名，请填写您的真实姓名
          </div>
          
        )
      }
    </>
  );
}

export default AccountName;
