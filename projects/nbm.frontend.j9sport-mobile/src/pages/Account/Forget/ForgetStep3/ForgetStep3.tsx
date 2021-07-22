import React, { useEffect, useState } from 'react';

import successImg from "../img/forget-success.png";
import { useHistory } from "react-router";
/**
 * 完成密码修改
 * @constructor
 */
function ForgetStep3() {
  const [count, setCount] = useState(5)
  const history = useHistory()

  const goLogin = () => {
    history.push('/login')
  }

  useEffect(() =>{
    setTimeout(() => {
      setCount(count -1)
    },1000)
    if (count === 0) {
      goLogin()
    }
  },[count])
  return (
    <div className="acc-container step3">
      <img src={successImg} alt=""/>
      <span>您已经成功修改密码，去登录吧～</span>
      <button className="acc-button" onClick={goLogin}>去登录（{count}s）</button>
    </div>
  );
}

export default ForgetStep3;