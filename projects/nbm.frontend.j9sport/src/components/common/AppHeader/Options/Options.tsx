import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { message, Popover } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { CURRENCY_MAP_TEXT } from "../../../../consts/app";
import { useApi } from '../../../../apis';
import Bet from '../../../../apis/Bet';
import mergeClass from '../../../../utils/mergeClass';

import memberStore from '../../../../stores/member';
import CartStore from '../../../../stores/cart/Cart';

import M from '../../m';
import Preference from './Preference';
import Dialog from "../../../member/Dialog";
import ImageRecharge from './img/recharge.svg';
import ImageWithdraw from './img/withdraw.svg';
import ImageRefresh from './img/refresh.svg';
import ImageAvatar from './img/user-avatar.png';
import MenuItem from "../../../member/MemberItem";
import CurrencyDialog from "./CurrencyDialog";

import {
  IconOrders,
  IconRecords,
  IconSettings,
  IconWallet
} from "../../../member/MemberInfo/icons";
import User, { BalanceTarget } from "../../../../apis/User";
import LoadingBar from '../../LoadingBar';

import AppConfig from '../../../../configs';

const MENUS = [
  {
    url: '/member/wallet',
    name: '我的钱包',
    icon: IconWallet
  },
  {
    url: '/member/orders',
    name: '我的注单',
    icon: IconOrders
  },
  {
    url: '/member/amount-records',
    name: '交易记录',
    icon: IconRecords
  },
  {
    url: '/member/settings',
    name: '账户设置',
    icon: IconSettings
  },
];

/* eslint-disable jsx-a11y/anchor-is-valid */
function Options() {
  const location = useLocation();
  const history = useHistory();
  const [bet, user] = useApi([Bet, User])
  const [preferenceVisible, setPreferenceVisible] = useState(false);
  const [currencyVisible, setCurrencyVisible] = useState(false)

  const {
    username,
    currency,
    isLoged,
    reloadVersion
  } = memberStore;

  const { ticketCount } = CartStore;

  const UserContent = () => {
    return (
      <div className="option-memberinfo">
        <header>
          {username}
          <div className="option-memberinfo-currency">
            货币类型: {CURRENCY_MAP_TEXT[memberStore.currency]}
            <button onClick={() => setCurrencyVisible(true)}>切换</button>
          </div>
        </header>
        <div className="option-memberinfo-menus">
          {
            MENUS.map(item => (
              <MenuItem
                key={item.url}
                menu={item}
              />
            ))
          }
        </div>
        <button
          onClick={() => {
            const hide = message.loading('请稍后...');
            user.loginOut().finally(() => {
              memberStore.memberInfo = null;
              history.replace('/home');
              hide();
            })
          }}
        >
          退出
        </button>
      </div>
    )
  }

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

  React.useEffect(() => {
    if (!memberStore.j9Reloading && memberStore.j9TransModalVisible) {
      message.success('转回成功')
      memberStore.j9TransModalVisible = false
    }
  },[memberStore.j9Reloading])
  let memberComps = null;
  if (!isLoged) {
    memberComps = (
      memberStore.j9Reloading ? (
        <LoadingOutlined/>
      ) : (
        <>
          <a
            className="btn-login"
            onClick={() => memberStore.goLogin()}
          >
            <M id="pages.signin"/>
          </a>
          <a onClick={() => memberStore.goRegister()}><M id="pages.signup"/></a>
        </>
      )
    );
  } else {
    memberComps = (
      <>
        {/*充值*/}
        <Link to="/member/recharge">
          <img src={ImageRecharge} alt=""/>
          充值
        </Link>
        {/*提现*/}
        <Link to="/member/withdrawal/usdt">
          <img src={ImageWithdraw} alt=""/>
          提现
        </Link>
        {
          location.pathname.includes('/member')
          ? undefined
          : (
            <div
              className="btn-reload"
              onClick={() => memberStore.reload()}
            >
              游戏额度：
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
        {/*小人头*/}
        <Popover
          placement="topRight"
          trigger="hover"
          content={UserContent}
        >
          <Link
            to="/member"
            className="user-avatar"
          >
            <img src={ImageAvatar} alt=""/>
          </Link>
        </Popover>
        <Dialog
          open={memberStore.j9TransModalVisible}
          className="transfer-dialog"
          imgbg
        >
          <h2>您的额度需要转回九游体育,点击立即转回即可游玩</h2>
          <button
            className="transfer-btn"
            onClick={() => {
              !memberStore.j9Reloading && memberStore.reload()
            }}
          >
            {
              memberStore.j9Reloading
                ? <>
                    正在转回余额,请稍等&nbsp;
                    <LoadingOutlined />
                  </>
                : '立即转回'
            }
          </button>
        </Dialog>
        {/*货币选择*/}
        <CurrencyDialog
          open={currencyVisible}
          onClose={() => setCurrencyVisible(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="header-options">
        <div onClick={() => setPreferenceVisible(!preferenceVisible)}>
          <M id="settings.title"/>
        </div>
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
