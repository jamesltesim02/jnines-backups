import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Icon } from "antd-mobile";
import { Link } from "react-router-dom";
import { toSignin, toDeposit } from "../../../utils/MainSiteUtils";
import M from '../../../components/common/m'

import userAvatarImg from './img/user-avatar@3x.png';
import hideImg from '../../../../src/components/common/AppHeader/images/hide.png'
import showImg from '../../../../src/components/common/AppHeader/images/show.png'
import { CURRENCY_MAP } from "../../../consts/app";
import memberStore from "../../../stores/member";
import cartStore from '../../../stores/cart'
import mergeClass from "../../../utils/mergeClass";

function Member(
  {
    active = false
  }: {
    active: boolean
  }
) {

  useEffect(() => {
    cartStore.ticketCountTip = false
  },[])

  const [showBalance, setShowBalance] = useState(true)

  const optionList = [
    [
      {title: <M id="pages.my_orders" />, url: '/ticket'},
      {title: <M id="pages.red_record" />, url: '/re-records'}
    ],
    [
      {title: <M id="settings.title" />, url: '/preference'}
    ],
    [
      {title: <M id="pages.rules" />, url: '/rules'},
      {title: <M id="pages.special_rules" />, url: '/special-note'},
    ]
  ]

  return (
    <div className="tabs-member">
      <div className="dark">
        <div className="tabs-member-username">
          <img src={userAvatarImg} alt=""/>
          {
            memberStore.memberInfo?.customerId || <M id="common.sign_first" />
          }
        </div>
        <div className="tabs-member-balance">
          <div className="tit">
            <span>
              <M id="pages.balance" />
            </span>
            <button onClick={() => {
              memberStore.isLoged && setShowBalance(() => !showBalance)
            }}
            >
              <img src={showBalance ? showImg : hideImg} alt=""/>
            </button>
          </div>
          <div className="balance">
            {
              memberStore.isLoged && showBalance
                ? `${CURRENCY_MAP[memberStore.currency]} ${memberStore.balance.toFixed(2)}`
                : '*****'
            }
          </div>
          <div className="topUp">
            {/*提现/登录*/}
            <button onClick={() => memberStore.isLoged ? toDeposit() : toSignin()}>
              {memberStore.isLoged ? <M id="common.cash_out" /> : <M id="common.login" />}
            </button>
            {/*充值/注册*/}
            <button onClick={() => memberStore.isLoged ? toDeposit() : toSignin()}>
              {memberStore.isLoged ? <M id="common.cash_in" /> : <M id="common.reg" />}
            </button>
          </div>
        </div>
      </div>
      <ul className="tabs-member-option">
        {
          optionList.map((options, index) => (
            <li key={index}>
              {
                options.map((item:any) => (
                  <Link to={item.url} key={item.url}>
                    <span
                      className={
                        mergeClass({
                          'tips' : item.url === '/ticket' && cartStore.ticketCount > 0
                        })
                      }
                    >
                      {item.title}
                    </span>
                    <Icon type="right" color="var(--arrow-color)"/>
                  </Link>
                ))
              }
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default observer(Member);
