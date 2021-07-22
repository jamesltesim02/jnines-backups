import React, { useState } from 'react';
import { observer } from "mobx-react";
import { CSSTransition } from "react-transition-group";
import { Icon, Toast } from 'antd-mobile'
import { toSignin, toDeposit } from "../../../../../utils/MainSiteUtils";
import memberStore from "../../../../../stores/member";
import { Link } from "react-router-dom";
import { CURRENCY_MAP } from "../../../../../consts/app";

import regImg from '../../images/reg.png'
import loginImg from '../../images/login.png'
import refreshImg from '../../images/refresh.png'
import showImg from '../../images/show.png'
import hideImg from '../../images/hide.png'

import M from '../../../../common/m'
import { useIntl } from "react-intl";

function MemberPopup(
  {
    isOpen = false,
    closePopup = () => {
    }
  }
) {

  const intl = useIntl()

  // 余额 显示/隐藏
  const [showBalance, setShowBalance] = useState(true)

  return (
    <>
      <CSSTransition
        in={isOpen}
        timeout={300}
        unmountOnExit
        classNames="member-popup-wrapper"
      >
        <div
          onClick={() => closePopup()}
          className="member-popup-wrapper"
        >
          <div
            onClick={event => event.stopPropagation()}
            className="member-popup-container"
          >
            {
              !memberStore.isLoged ?
                // 用户登录注册
                <div className="member-popup-container-account">
                  <div onClick={toSignin}>
                    <img src={regImg} alt=""/>
                    <span>
                      <M id="common.reg"/>
                    </span>
                  </div>
                  <div onClick={toSignin}>
                    <img src={loginImg} alt=""/>
                    <span>
                      <M id="common.login"/>
                    </span>
                  </div>
                </div>
                :
                // 用户信息
                <div className="member-popup-container-info">
                  <div>
                    {memberStore.username}
                  </div>
                  {/*存款*/}
                  <div className="info-balance">
                    <div>
                      {
                        showBalance ?
                          <span>
                            {CURRENCY_MAP[memberStore.currency]}
                            <span style={{fontSize: 14}}>
                              {memberStore.balance}
                            </span>
                          </span>
                          :
                          <span>*****</span>
                      }
                      {/*余额显示*/}
                      <span onClick={() => setShowBalance(!showBalance)}>
                        <img src={showBalance ? showImg : hideImg} alt=""/>
                      </span>
                      {/*刷新余额*/}
                      <span
                        onClick={() => {
                          memberStore.reload()
                          console.log('刷新余额')
                        }}
                      >
                        <img src={refreshImg} alt=""/>
                      </span>
                    </div>
                    {/*存款按钮*/}
                    <div className="deposit">
                      <button onClick={toDeposit}>
                        <M id="common.deposit"/>
                      </button>
                    </div>
                  </div>
                </div>
            }
            <div className="line"></div>
            {/*用户相关标签*/}
            <div className="member-popup-container-content">
              {/*优惠活动*/}
              <Link to={"/tab/discover/promotions"}>
                <M id="member.activities"/>
                <Icon type="right"/>
              </Link>
              {/*偏好设置*/}
              <Link to={'/preference'}>
                <M id="settings.title"/>
                <Icon type="right"/>
              </Link>
              {/*退出*/}
              {
                memberStore.isLoged
                &&
                <div onClick={() => {
                  memberStore.memberInfo = null
                  Toast.success(
                    intl.formatMessage({id: 'toast.logout'}),
                    1,
                    () => {
                      closePopup()
                    })
                }}
                >
                  <M id="member.logout"/>
                  <Icon type="right"/>
                </div>
              }
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
}

export default observer(MemberPopup);