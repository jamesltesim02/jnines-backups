import React, { useEffect, useState } from 'react';
import NavBar from "../../../../components/common/NavBar";
import { Link, useHistory } from "react-router-dom";
import { Icon, Toast } from "antd-mobile";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";

import memberStore from '../../../../stores/member';

function ProfileSettings() {

  const history = useHistory()
  const { user }: { user: User } = useApi({ user: User });
  const [phone, setPhone] = useState('')
  const [googleBindStatus, setGoogleBindStatus] = useState(false)
  const [creditPassStatus, setCreditPassStatus] = useState(false)

  const SETTING_MENUS: Array<{
    title: string
    url: string
    visible?: boolean | undefined
    extra?: string
    event?: Function
  }> = [
    {
      title: '修改手机号',
      url: '/member/profile-settings/change-phone',
      extra: phone
    },
    {
      title: '修改密码',
      url: '/member/profile-settings/change-password'
    },
    {
      title: '谷歌验证器',
      url: '/member/profile-settings/verify-google',
      extra: googleBindStatus ? '已绑定' : '未绑定'
    },
    {
      title: '资金密码',
      url: '/member/profile-settings/credit-password',
      extra: creditPassStatus ? '已开启' : '未开启'
    },
    {
      title: '安全登出',
      url: '/',
      event: () => {
        Toast.loading('请稍后...')
        user.loginOut().then(() => {
          memberStore.memberInfo = null;
          Toast.success('退出成功');
          history.replace('/');
        })
      }
    }
  ]

  useEffect(() => {
    // 获取是否绑定手机号
    user.getBindPhone().then((res: any) => {
      const {verifyStatus, phone} = res
      setPhone(phone)
    })
    // 获取是否绑定谷歌验证
    user.googleCheck().then((res: any) => {
      setGoogleBindStatus(res.googleBindStatus)
    })
    // 获取是否开启资金密码
    user.getCreditPasswordStatus().then(res => {
      setCreditPassStatus(res.fundsPasswordFlaf === 1);
    })
  },[])

  return (
    <div className="profile-settings">
      <NavBar title="账户设置" center/>
      {
        SETTING_MENUS.map((menu: any) => {
          if (!menu.visible && menu.visible !== undefined) {
            return null;
          }
          const itemComp = (
            <>
              <span>{menu.title}</span>
              <span>
                {menu.extra}
                <Icon type="right"/>
              </span>
            </>
          );
          return (
            <div
              key={menu.url}
              className="profile-settings-item"
            >
              {
                menu.event ? (
                  <a onClick={menu.event}>
                    {itemComp}
                  </a>
                ) : (
                  <Link to={menu.url}>
                    {itemComp}
                  </Link>
                )
              }
            </div>
          )
        })
      }
    </div>
  );
}

export default ProfileSettings;