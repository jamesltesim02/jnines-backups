import React from 'react';
import {Link} from "react-router-dom";

function AccountFooter(
  {
    type
  }: {
    type: 'forget-register' | 'login'
  }
  ) {

  if (type === 'forget-register') {
    return (
      <div className="acc-footer forget-register">
        <Link to={'/forget'}>
          忘记密码
        </Link>
        <div>
          没有账号？
          <Link to={'/register'}>
            在此注册
          </Link>
        </div>
      </div>
    )
  }
  if (type === "login") {
    return (
      <div className="acc-footer login">
        <div>
          已有账号？
          <Link to={'/login'}>
            在此登录
          </Link>
        </div>
      </div>
    );
  }
  return  null
}

export default AccountFooter;