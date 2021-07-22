import React from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';

import { withApi } from '../../apis';
import Bet from '../../apis/Bet';
import Pull from '../../apis/Pull';

import appStore from '../../stores/app';
import memberStore from '../../stores/member';

import LoadingBar from './LoadingBar';
import Error403 from '../../pages/Error/Error403';
import Error503 from '../../pages/Error/Error503';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import collect, { CollectType } from '../../utils/collect';
import User, { BalanceTarget } from '../../apis/User';
import AppConfig from '../../configs';

import CreditTransferDialog from '../member/MemberInfo/CreditTransferDialog';

/* eslint-disable react-hooks/exhaustive-deps */
function AppInitial (
  {
    api: {
      bet,
      pull,
      user
    },
    children
  }: {
    api: {
      bet: Bet,
      pull: Pull,
      user: User
    },
    children: any
  }
) {
  const { systemState } = appStore;

  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const [checking, setChecking] = React.useState(true);
  const [lastpath, setLastpath] = React.useState('');

  // 监听路由变化
  React.useEffect(
    () => {
      appStore.firstRoute = false;
      let loadTime = undefined;
      let renderTime = undefined;

      if (!lastpath && window.performance?.timing) {
        try {
          loadTime = (
            window.performance.timing.responseEnd
            -
            window.performance.timing.navigationStart
          );
          renderTime = (
            (window.performance.timing.domComplete || Date.now())
            -
            window.performance.timing.domLoading
          );
        } catch (e) {}
      }

      // 用户行为统计上报 (普通浏览)
      collect({
        type: CollectType.SURFING,
        loadTime,
        renderTime
      });

      if (location.pathname !== lastpath) {
        setLastpath(location.pathname);
      }
    },
    [location, setLastpath]
  );

  // 系统初始化加载
  React.useEffect(
    () => {
      // 用户相关数据初始化查询
      const userInitial = async () => {

        const search = window.location.search;
        const params = new URLSearchParams(search);
        appStore.queryString = search;

        // TODO 将默认currency添加到CONST中
        const currency = Number(params.get('currency')) || 2;

        const frontId = params.get('frontId');
        if (frontId) {
          appStore.frontId = frontId;
        }

        const ct = Number(params.get('clientType'));
        if (ct) {
          appStore.clientType = ct;
        }

        const origin = params.get('origin');
        if(origin) {
          appStore.origin = decodeURIComponent(origin);
        }

        const loginUrl = params.get('loginUrl');
        if (loginUrl) {
          appStore.loginUrl = decodeURIComponent(loginUrl);
        }

        let nbToken = params.get('token') || memberStore.nbToken;
        const agToken = params.get('j9Token') || memberStore.agToken;

        // 第三方模式(从老的余额查询bet.balance的流程)
        if (AppConfig.THIRD_MODE) {
          // 如果nbToken为空,则表示用户未登录则不需要继续查询
          if (!nbToken) {
            return;
          }
          try {
            memberStore.j9Reloading = true;
            // bet.balance的设置流程
            const result = await bet.getBalance(nbToken);
            memberStore.memberInfo = {
              userId: result.nbUserId,
              nbToken,
              customerId: result.customerId,
              balance: result.balance,
              currency: result.currency
            };
          } finally {
            memberStore.j9Reloading = false;
          }
        }
        // 独立站模式(从新余额接口查询)
        else {
          // 如果需要打开登录或注册窗口
          const accountModal: any = params.get('accountModal');
          if (accountModal) {
            memberStore.accountModal = {visible: true, type: accountModal }
            return;
          }

          // 如果nbToken和agToken都是空则表示未登录
          if (!nbToken && !agToken) {
            return;
          }

          try {
            memberStore.j9Reloading = true;
            if (!nbToken && agToken) {
              const initResult = await user.initFromAgToken(agToken, currency);
              memberStore.memberInfo = {
                agToken,
                currency,
                nbToken: initResult.nbToken,
                userId: initResult.nbUserId,
                customerId: initResult.loginName
              };
            }
            const userBalance = await user.userBalance({
              target: (
                (
                  location.pathname.includes('/other/')
                  ||
                  location.pathname.includes('/member')
                ) ? undefined
                : BalanceTarget.SABA_API
              )
            });
            if (!userBalance || !userBalance.customerId) {
              return;
            }
            // 设置用户信息
            memberStore.memberInfo = {
              ...memberStore.memberInfo,
              ...userBalance,
              userId: userBalance.nbUserId,
            };
            // 设置用户的余额信息
            memberStore.j9Balance = {
              ...memberStore.j9Balance,
              targetBalance: userBalance.targetBalance,
              sportBalance: userBalance.totalBalance,
              withdrawableBalance: userBalance.availableBalance
            };

            // 判断体育厅余额是否小于1
            if (
              userBalance.totalBalance < 10
              &&
              !location.pathname.includes('/other/')
            ) {
              // 小于1则需要查询主站余额
              const result = await user.fundBalance();

              memberStore.j9Balance = {
                ...memberStore.j9Balance,
                ...result
              };

              // 如果主站余额大于1,则需要弹窗提示是否要转额
              if (memberStore.j9Balance.localBalance > 10) {
                memberStore.creditTransfering = true;
              }
            }
          } finally {
            memberStore.j9Reloading = false;
          }
        }

        await Promise.all([
          // 查询已收藏比赛
          pull.getFavIds(),
          // 查询用户配置信息
          pull.getSettings()
        ]).then(([ids, setttings]) => {
          memberStore.setFavs(ids);
          if (setttings) {
            appStore.setSettings({
              acceptAmount: setttings.stake,
              locale: appStore.locale,
              oddsAccept: setttings.accept,
              theme: setttings.theme,
              goalSound: setttings.goalNotify
            });
          }
        })
      };

      // 执行系统初始化加载
      Promise.all([
        // 获取系统应用状态(是否维护,是否地域限制等)
        new Promise((resolve: (value?: any) => void) => {
          pull.getSystemState().catch(() => {}).finally(resolve);
        }),
        // 查询用户相关信息
        userInitial()
      ]).finally(
        () => setChecking(false)
      )
    },
    [pull, bet, memberStore.nbToken]
  );

  // 全局toast消息
  React.useEffect(
    () => {
      const handleToastEvent = (event: any) => {
        const {
          detail: {
            type = 'info',
            intl: i18nMessage,
            ...detail
          }
        } = event;
        
        if (i18nMessage) {
          detail.content = intl.formatMessage(i18nMessage);
        }

        (message as any)[type](detail);
      };

      // 路由跳转事件
      const handleRoute = (event: any) => {
        if (typeof event.detail !== 'function') {
          return;
        }
        event.detail(history, location);
      };

      // 页面报错事件
      const handleError = (error: any) => {
        // 用户行为统计上报 (普通浏览)
        collect({
          type: CollectType.EVENTLOG,
          error: JSON.stringify(error)
        });
      };

      window.addEventListener('toast', handleToastEvent);
      window.addEventListener('error', handleError);
      window.addEventListener('route', handleRoute);

      return () => {
        window.removeEventListener('toast', handleToastEvent);
        window.removeEventListener('error', handleError);
        window.removeEventListener('route', handleRoute);
      };
    },
    [intl]
  );
  React.useEffect(() => {
    document.title = intl.formatMessage({id: 'common.org'})
  })
  // 正在加载系统状态显示为loading
  if (checking) {
    return (<LoadingBar />);
  }

  // 地域限制
  if (systemState.forbbiden) {
    return (<Error403 />);
  }

  // 维护中
  if (systemState.mainting) {
    return (<Error503 />);
  }

  return (
    <>
      {children}
      {
        (
          AppConfig.THIRD_MODE
          &&
          memberStore.isLoged
        ) ? null : (
          <CreditTransferDialog
            open={memberStore.creditTransfering}
            onClose={() => memberStore.creditTransfering = false}
            onFinish={() => {
              memberStore.reload();
              memberStore.creditTransfering = false
            }}
            balance={memberStore.j9Balance}
          />
        )
      }
    </>
  );
}

export default withApi({
  bet: Bet,
  pull: Pull,
  user: User
})(
  observer(AppInitial)
);
