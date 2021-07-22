import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { SyncOutlined } from '@ant-design/icons';

import {
  // IconAboutus,
  IconOrders,
  IconRecords,
  IconRedEnv,
  IconRules,
  IconSettings,
  IconWallet,
  IconWashCode
} from './icons';

import memberStore from '../../../stores/member';
import { useApi } from '../../../apis';
import User, { BalanceTarget } from '../../../apis/User';
import LoadingBar from '../../common/LoadingBar';
import IconLevel from './icons/IconLevel';
import MenuItem from '../MemberItem';
import mergeClass from '../../../utils/mergeClass';

import IconBalanceWallet from './images/icon-balance-wallet.svg';
// import CreditTransferDialog from './CreditTransferDialog';
import { MEMBER_RELOAD_EVENT } from '../../../consts/app';

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
    url: '/promo-detail/red-envelope',
    name: '红包记录',
    icon: IconRedEnv
  },
  {
    url: '/member/amount-records',
    name: '交易记录',
    icon: IconRecords
  },
  {
    // url: '/member/rules',
    url: '/rules',
    name: '玩法规则',
    icon: IconRules
  },
  // {
  //   url: '/member/aboutus',
  //   name: '关于我们',
  //   icon: IconAboutus
  // },
  {
    url: '/member/settings',
    name: '账户设置',
    icon: IconSettings
  },
  {
    url: '/member/wash-code',
    name: '游戏洗码',
    icon: IconWashCode
  },
];

function MemberInfo () {

  const balance = memberStore.j9Balance;
  const { user } : { user: User } = useApi({ user: User });

  // const [transferable, setTransferable] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const queryBalance = React.useCallback(
    async () => {
      // Promise.all([
      //   // user.userBalance({ target: BalanceTarget.SABA_API }),
      //   user.userBalance(),
      //   user.fundBalance()
      // ]).then(([sportBalance, mainBalance]) => {
      //   memberStore.j9Balance = {
      //     ...mainBalance,
      //     targetBalance: sportBalance.targetBalance,
      //     sportBalance: sportBalance.totalBalance,
      //     withdrawableBalance: sportBalance.availableBalance
      //   };
      // }).finally(
      //   () => {
      //     memberStore.j9Reloading = false;
      //     setLoading(false);
      //   }
      // );
      // user.userBalance({
      //   target: BalanceTarget.SPORT
      // }).then(sportBalance => {
      //   return new Promise((resolve, reject) => {
      //     user.fundBalance().then(
      //       mainBalance => resolve([sportBalance, mainBalance])
      //     ).catch(reject)
      //   })
      // })
      try {
        if (!memberStore.isLoged) {
          return;
        }
        memberStore.j9Reloading = true;
        setLoading(true);

        const mainBalance = await user.fundBalance();
        const sportBalance = await user.userBalance({ target: BalanceTarget.SPORT });

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
    [user, memberStore.isLoged]
  );


  React.useEffect(
    () => {
      queryBalance();
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
      <div className="member-info">
        <div className="info">
          <div className="username">
            <div>
              {memberStore.username}
              <IconLevel level={balance?.level || 0} />
            </div>
            {/* TODO 如果没有登录时间则去掉 */}
            {/* <label>上次登录时间: 2020-07-20</label> */}
          </div>
          <div className="credit">
            <div className="balance">
              <div className="balance-field sport-wallet">
                <label>
                  <img src={IconBalanceWallet} />体育钱包余额
                </label>
                <div>
                  <span>{loading ? '加载中...' : `${Number(balance?.sportBalance).toFixed(2)} USDT`}</span>
                </div>
              </div>
              <div className="balance-field main-wallet">
                <label>
                  <img src={IconBalanceWallet} />总钱包余额(含体育)
                </label>
                <div>
                  <span>{
                    loading
                    ? '加载中...'
                    // : `${Number(balance?.localBalance + balance?.sportBalance).toFixed(2)} USDT`
                    : `${Number(balance?.totalBalance).toFixed(2)} USDT`
                  }</span>
                </div>
              </div>
            </div>
            <div className="btns">
              <button
                className={mergeClass({
                  'btn-reload': true,
                  'available': !loading,
                })}
                onClick={
                  loading
                  ? undefined
                  : queryBalance
                }
              >
                {
                  loading
                  ? <LoadingBar />
                  : <SyncOutlined />
                }
              </button>
              <button
                className="btn-transfer"
                onClick={
                  loading
                  ? undefined
                  // : () => setTransferable(true)
                  : () => memberStore.creditTransfering = true
                }
              >额度转换</button>
            </div>
          </div>
          <div className="buttons">
            <Link
              to="/member/recharge"
              className="btn-recharge"
            >充值</Link>
            <Link
              to="/member/withdrawal"
              className="btn-withdrawal"
            >提现</Link>
          </div>
        </div>
        <div className="menus">
          {
            MENUS.map(item => (
              <MenuItem
                key={item.url}
                menu={item}
              />
            ))
          }
        </div>
      </div>
      {/* <CreditTransferDialog
        open={transferable}
        onClose={() => setTransferable(false)}
        onFinish={() => {
          queryBalance();
          setTransferable(false)
        }}
        balance={balance}
      /> */}
    </>
  );
}

export default observer(MemberInfo);
