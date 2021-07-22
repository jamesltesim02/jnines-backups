import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Icon, Modal, Toast } from "antd-mobile";
import { Link, useHistory } from "react-router-dom";
import { CURRENCY_TEXT } from "../../../consts/app";
import AppConfig from "../../../configs";
import M from '../../../components/common/m'
import CurrencyDialog from "../../../components/member/CurrencyDialog";

import userAvatarImg from './img/user-avatar@3x.png';
import cashinImg from './img/cashin.png';
import withdrawImg from './img/withdraw.png';
import withdrawImgWhite from './img/withdraw-white.png';
import cashinImgWhite from './img/cashin-white.png';

import { MEMBER_RELOAD_EVENT } from '../../../consts/app';
import memberStore from '../../../stores/member';
import cartStore from '../../../stores/cart'
import mergeClass from '../../../utils/mergeClass';
import app from '../../../stores/app';

import IconWallet from './icons/IconWallet';
import IconOrders from './icons/IconOrders';
import IconRedenvelop from './icons/IconRedenvelop';
import IconRecords from './icons/IconRecords';
import ImageCustom from './img/custom.svg';
import { useIntl } from "react-intl";
import { useApi } from '../../../apis';
import User, { Balance, BalanceTarget } from '../../../apis/User';

import IconReload from './img/icon-reload.svg';
import LoadingBar from '../../../components/common/LoadingBar';
import OnlineCustomerService from "../../../components/common/OnlineCustomerService";
import LineDialog from "../../../components/member/LineDialog";
// import CreditTransferDialog from '../../../components/member/CreditTransferDialog/CreditTransferDialog';


// import hideImg from '../../../../src/components/common/AppHeader/images/hide.png';
// import showImg from '../../../../src/components/common/AppHeader/images/show.png';

/** 横向菜单列表 */
const HORIZONTAL_MENUS: Array<{
  title?: string,
  titleKey?: string,
  url: string,
  icon: any,
  login?: boolean
}> = [
  // 我的钱包
  {
    icon: <IconWallet/>,
    title: '我的钱包',
    url: '/member/wallet',
    login: true,
  },
  // 我的注单
  {
    icon: <IconOrders/>,
    title: '我的注单',
    url: '/ticket',
    login: true,
  },
  // 红包记录
  {
    icon: <IconRedenvelop/>,
    title: '红包记录',
    url: '/promo-detail/red-envelope',
    login: true,
  },
  // 交易记录
  {
    icon: <IconRecords/>,
    title: '交易记录',
    url: '/member/records',
    login: true,
  },
];

// 其他选项
const VERTICAL_MENUS: Array<Array<{
  title?: string,
  titleKey?: string,
  login?: boolean
  url: string
}>> = [
  [
    // 游戏洗码
    {title: '游戏洗码', url: '/member/wash-code', login: true},
    // 账户设置
    {title: '账户设置', url: '/member/profile-settings', login: true},
    // 偏好设置
    {titleKey: 'settings.title', url: '/preference'}
  ],
  [
    // 玩法规则
    {titleKey: 'pages.rules', url: '/rules'},
    // 特别说明
    {titleKey: 'pages.special_rules', url: '/special-note'},
    // 关于我们
    // { title: '关于我们', url: '/about-us' },
  ]
]

function Member() {

  const {
    j9Balance: balance,
    reloadVersion,
  } = memberStore;
  const intl = useIntl()
  const history = useHistory();
  const {user}: { user: User } = useApi({user: User});
  const [currencyVisible, setCurrencyVisible] = useState(false)
  const [lineVisible, setLineVisible] = useState(false)
  // const [transferable, setTransferable] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // 取款操作
  const handleWithdrawal = async () => {
    try {
      Toast.loading('正在处理,请稍后...');
      const withdrawalable = await user.checkWithdrawal();
      if (withdrawalable) {
        history.push('/member/withdrawal');
      } else {
        Modal.alert(
          '申请提币',
          <>您还没有可用于提币的USDT钱包，<br/>请先添加一张USDT钱包。</>,
          [
            {text: '暂不添加'},
            {
              text: '添加钱包',
              onPress: () => history.push('/member/wallet')
            }
          ]
        );
      }
      Toast.hide();
    } finally {
    }
  };

  const queryBalance = React.useCallback(
    async () => {
      try {
        if (!memberStore.isLoged) {
          return;
        }
        memberStore.j9Reloading = true;
        setLoading(true);
        const mainBalance = await user.fundBalance();
        const sportBalance = await user.userBalance({target: BalanceTarget.SPORT});
        memberStore.j9Balance = {
          ...mainBalance,
          targetBalance: sportBalance.targetBalance,
          sportBalance: sportBalance.totalBalance,
          withdrawableBalance: sportBalance.availableBalance
        };
      } finally {
        memberStore.j9Reloading = false;
        setLoading(false);
      }
    },
    [user, memberStore]
  );

  useEffect(
    () => {
      queryBalance();
    },
    [reloadVersion]
  );

  useEffect(
    () => {
      cartStore.ticketCountTip = false;
      window.addEventListener(MEMBER_RELOAD_EVENT, queryBalance);
      return () => {
        window.removeEventListener(MEMBER_RELOAD_EVENT, queryBalance);
        memberStore.reload();
      }
    },
    []
  );

  return (
    <>
      <div className="tabs-member">
        <div>
          {/*用户名*/}
          <div className="tabs-member-username">
            <div>
              <img src={userAvatarImg} alt=""/>
              {memberStore.memberInfo?.customerId || <M id="common.sign_first"/>}
            </div>
            <OnlineCustomerService className="customer">
              <img src={ImageCustom} alt=""/>
            </OnlineCustomerService>
          </div>
          {/*用户余额*/}
          <div className="tabs-member-balance">
            <div className="balance-block">
              <div className="credits">
                <label>体育钱包余额</label>
                <span>
                  {
                    loading
                      ? '加载中...'
                      : (
                        memberStore.isLoged
                          ? `${Number(balance?.sportBalance).toFixed(2)} USDT`
                          : '***.**'
                      )
                  }
                </span>
                <label>总钱包余额(含体育)</label>
                <span>
                  {
                    loading
                      ? '加载中...'
                      : (
                        memberStore.isLoged
                          // ? `${Number(balance?.localBalance + balance?.sportBalance).toFixed(2)} USDT`
                          ? `${Number(balance?.totalBalance).toFixed(2)} USDT`
                          : '***.**'
                      )
                  }
                </span>
              </div>
              <div className="btns">
                {
                  memberStore.isLoged
                    ? (
                      <>
                        <button
                          className="btn-reload"
                          onClick={
                            loading
                              ? undefined
                              : queryBalance
                          }
                        >
                          {
                            loading
                              ? <LoadingBar/>
                              : <img src={IconReload}/>
                          }
                        </button>
                        <button
                          className="btn-transfer"
                          onClick={
                            loading
                              ? undefined
                              : () => memberStore.creditTransfering = true
                            // : () => setTransferable(true)
                          }
                        >额度转账
                        </button>
                      </>
                    ) : null
                }
              </div>
            </div>
            <div className="topUp">
              {/*提现/登录*/}
              <button
                onClick={
                  memberStore.isLoged
                    ? handleWithdrawal
                    : () => history.push('/login')
                }
              >
                {memberStore.isLoged && <img src={app.skin === 'dark' ? withdrawImgWhite : withdrawImg} alt=""/>}
                {memberStore.isLoged ? <M id="common.cash_out"/> : <M id="common.login"/>}
              </button>
              {/*充值/注册*/}
              <button
                onClick={() => {
                  memberStore.isLoged
                    ? history.push('/member/recharge')
                    : history.push('/register')
                }}>
                {memberStore.isLoged && <img src={app.skin === 'dark' ? cashinImgWhite : cashinImg} alt=""/>}
                {memberStore.isLoged ? <M id="common.cash_in"/> : <M id="common.reg"/>}
              </button>
            </div>
          </div>
        </div>
        {/* 横向排列菜单入口 */}
        <section className="tabs-member-horizontal-menus">
          {
            HORIZONTAL_MENUS.map(item => (
              <Link
                key={item.url}
                to={item.url}
                onClick={(ev) => {
                  if (item.login && !memberStore.isLoged) {
                    ev.preventDefault()
                    Toast.info(intl.formatMessage({id: 'common.sign_first'}),)
                    setTimeout(() => {
                      history.push("/login")
                    }, 1500)
                  }
                }}
              >
                {item.icon}
                <label>
                  {
                    item.titleKey
                      ? <M id={item.titleKey}/>
                      : item.title
                  }
                </label>
              </Link>
            ))
          }
        </section>
        {/* 其他选项 */}
        <ul className="tabs-member-option">
          <li>
            {/*货币类型*/}
            <a onClick={() => {
              setCurrencyVisible(true)
            }}>
              货币类型
              <span>
                {CURRENCY_TEXT[memberStore.currency]}
                <Icon type="right" color="var(--arrow-color)"/>
              </span>
            </a>
            {/*线路选择*/}
            {
              AppConfig.LINE_LIST.find((line: string) => line.includes(window.location.hostname))
              &&
              <a onClick={() => {
                setLineVisible(true)
              }}>
                线路优选
                <span>
                <Icon type="right" color="var(--arrow-color)"/>
              </span>
              </a>
            }
          </li>
          {
            VERTICAL_MENUS.map((options, index) => (
              <li key={index}>
                {
                  options.map((item: any) => (
                    <Link
                      key={item.url}
                      to={item.url}
                      onClick={(ev) => {
                        if (item.login && !memberStore.isLoged) {
                          ev.preventDefault()
                          Toast.info(intl.formatMessage({id: 'common.sign_first'}),)
                          setTimeout(() => {
                            history.push("/login")
                          }, 1500)
                        }
                      }}
                    >
                      <span
                        className={
                          mergeClass({
                            'tips': item.url === '/ticket' && cartStore.ticketCount > 0
                          })
                        }
                      >
                        {
                          item.titleKey
                            ? <M id={item.titleKey}/>
                            : item.title
                        }
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
      {/*线路选择*/}
      <LineDialog
        open={lineVisible}
        onClose={() => setLineVisible(false)}
      />
      {/*货币类型弹窗*/}
      <CurrencyDialog
        open={currencyVisible}
        onClose={() => setCurrencyVisible(false)}
      />
    </>
  );
}

export default observer(Member);
