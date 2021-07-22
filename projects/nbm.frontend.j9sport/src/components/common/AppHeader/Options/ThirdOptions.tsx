import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Link, useLocation } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { LoadingOutlined } from '@ant-design/icons';
import { CURRENCY_MAP_TEXT } from "../../../../consts/app";
import { useApi } from '../../../../apis';
import Bet from '../../../../apis/Bet';

import appStore from '../../../../stores/app';
import memberStore from '../../../../stores/member';
import CartStore from '../../../../stores/cart/Cart';

import M from '../../m';
import Preference from './Preference';
import ImageRefresh from './img/refresh.svg';

import User, { BalanceTarget } from "../../../../apis/User";
import LocaleSwither from './LocaleSwitcher';
import LoadingBar from '../../LoadingBar';

import AppConfig from '../../../../configs';
import { toSignin, toSignup } from '../../../../utils/ThirdSiteUtils';

/* eslint-disable jsx-a11y/anchor-is-valid */
function Options() {
  const location = useLocation();
  const [bet, user] = useApi([Bet, User])
  const [preferenceVisible, setPreferenceVisible] = useState(false);

  const {
    username,
    currency,
    isLoged,
    reloadVersion
  } = memberStore;

  const { ticketCount } = CartStore;

  const getBalance = React.useCallback(
    () => {
      if (memberStore.j9Reloading) {
        return;
      }
      if (memberStore.isLoged) {
        memberStore.j9Reloading = true
        if (AppConfig.THIRD_MODE) {
          bet.getBalance(memberStore.nbToken).then((result: any) => {
            memberStore.memberInfo = {
              ...memberStore.memberInfo,
              userId: result.nbUserId,
              customerId: result.customerId,
              balance: result.balance,
              currency: result.currency
            };
          }).finally(
            () => memberStore.j9Reloading = false
          )
        } else {
          user.userBalance({
            target: BalanceTarget.SABA_API,
            onlyRead: memberStore.reloadOnlyRead
          }).then((userBalance: any) => {
            // 设置用户的余额信息
            memberStore.j9Balance = {
              ...memberStore.j9Balance,
              targetBalance: userBalance.targetBalance,
              sportBalance: userBalance.totalBalance,
              withdrawableBalance: userBalance.availableBalance
            };
          }).finally(
            () => memberStore.j9Reloading = false
          )
        }
      } else {
        memberStore.j9Reloading = false
      }
    },
    [user, memberStore]
  );

  React.useEffect(
    () => {
      if (!/^\/member/i.test(location.pathname)) {
        getBalance()
      }
    },
    [reloadVersion]
  );

  React.useEffect(
    () => {
      // 增加右上角小红点
      if (ticketCount > 0) {
        const ticketEl = document.getElementById('options-ticket-link')
        if (ticketEl) {
          ticketEl.classList.add('top-right-dot')
        }
      }
    },
    [ticketCount]
  );

  let memberComps = null;
  if (!isLoged) {
    memberComps = (
      memberStore.j9Reloading ? (
        <LoadingOutlined/>
      ) : (
        <>
          <a
            className="btn-login"
            onClick={toSignin}
          >
            <M id="pages.signin"/>
          </a>
          <a onClick={toSignup}>
            <M id="pages.signup"/>
          </a>
        </>
      )
    );
  } else {
    memberComps = (
      <>
        {/*充值*/}
        <Link to="/ticket">
          <M id="pages.my_orders" />
        </Link>
        <div>
          {username}
        </div>
        {
          location.pathname.includes('/member')
          ? undefined
          : (
            <div
              className="btn-reload"
              onClick={() => memberStore.reload()}
            >
              <M id="pages.game_credit" />：
              {
                memberStore.j9Reloading
                ? '**.**'
                : memberStore.balance
              } {CURRENCY_MAP_TEXT[currency]}
              {
                memberStore.j9Reloading
                ? <LoadingBar />
                : <img
                  src={ImageRefresh}
                  alt=""
                />
              }
            </div>
          )
        }
      </>
    );
  }

  return (
    <>
      <div className="header-options">
        <div onClick={() => setPreferenceVisible(!preferenceVisible)}>
          <M id="settings.title"/>
        </div>
        <LocaleSwither />
        {memberComps}
      </div>
      {/*偏好设置窗口*/}
      <QueueAnim>
        {
          preferenceVisible ? [
            <Preference
              key="Preference"
              onClose={() => setPreferenceVisible(!preferenceVisible)}
            />
          ] : null
        }
      </QueueAnim>
    </>
  )
}

export default observer(Options);
