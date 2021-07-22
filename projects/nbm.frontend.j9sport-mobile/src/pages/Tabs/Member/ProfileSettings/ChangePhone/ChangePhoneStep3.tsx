import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ImageSuccess from './img/success.png';

function ChangePhoneStep3() {
  const [count, setCount] = useState(5)
  const history = useHistory()

  const goBackToSettings  = () => {
    history.push('/member/profile-settings')
  }

  useEffect(() => {
    setTimeout(() => {
      setCount(count - 1)
      if (count < 1) {
        goBackToSettings()
      }
    },1000)
  },[count])

  return (
    <div className="profile-container change-success">
      <img src={ImageSuccess} alt=""/>
      <p>您已成功修改手机号码</p>
      <button
        onClick={goBackToSettings}
      >返回设置（{count} S）
      </button>
    </div>
  );
}

export default ChangePhoneStep3;