import React, { useEffect, useState } from 'react';
import { useApi } from "../../../../../apis";
import User from "../../../../../apis/User";
import { loginPasswordReg } from "../../../../../consts/regexr";

import NavBar from "../../../../../components/common/NavBar";
import PasswordInput from "../../../../Account/components/Input/PasswordInput";
import memberStore from "../../../../../stores/member";
import mergeClass from "../../../../../utils/mergeClass";
import { Toast } from "antd-mobile";
import { useHistory } from "react-router";

function ChangePassword() {
  const [user] = useApi([User])
  const history = useHistory()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [validate, setValidate] = useState(false)

  const passwordValidate = () => {
    if (!loginPasswordReg.test(newPassword)) {
      setMessage('请输入6~14位字母数字')
    } else {
      setMessage('')
    }
  }

  const submitModify = async () => {
    passwordValidate()
    if (!validate) {
      return;
    }
    try {
      Toast.loading('加载中...')
      await user.passwordChange({
        loginName: memberStore.username,
        password: newPassword,
        oldPassword,
      })
      Toast.success('修改密码成功')
      setTimeout(() => {
        history.goBack()
      },1500)
    } catch (e) {
    }
  }

  useEffect(() => {
    setValidate(
      !!oldPassword
      && !!newPassword
      && !message
    )
  }, [oldPassword, newPassword])

  return (
    <div className="change-password">
      <NavBar title="修改密码" center/>
      <div className="profile-container">
        <PasswordInput
          value={oldPassword}
          onChange={(event: any) => setOldPassword(event.target?.value.replace(" ", ''))}
          placeholder="请输入您的原始密码"
        />
        <PasswordInput
          value={newPassword}
          onBlur={passwordValidate}
          message={message}
          onChange={(event: any) => setNewPassword(event.target?.value.replace(" ", ''))}
          placeholder="请输入您的新密码"
        />
        <button
          className={
            mergeClass({
              "next-step": true,
              "next-step-active": validate
            })
          }
          onClick={submitModify}
        >
          完成修改
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;