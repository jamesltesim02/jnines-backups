import React from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { Toast } from 'antd-mobile';

import AppConfig from '../../configs';
import { useApi } from '../../apis';
import Bet from '../../apis/Bet';
import Pull from '../../apis/Pull';
import User, { BalanceTarget } from '../../apis/User';

import appStore from '../../stores/app';
import memberStore from '../../stores/member';

import LoadingBar from './LoadingBar';
import Error403 from '../../pages/Error/Error403';
import Error503 from '../../pages/Error/Error503';
import { StateExtra } from '../../consts/match';

import collect, { CollectType } from '../../utils/collect';
import CreditTransferDialog from '../member/CreditTransferDialog';

const toastMap: any = {
  success: Toast.success.bind(Toast),
  fail: Toast.fail.bind(Toast),
  warn: Toast.fail.bind(Toast),
  warning: Toast.fail.bind(Toast),
  error: Toast.fail.bind(Toast),
  info: Toast.info.bind(Toast),
  loading: Toast.loading.bind(Toast),
};

function AppInitial (
  {
    children
  }: {
    children: any
  }
) {
  const { systemState } = appStore;

  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();

  const [bet, pull, user]: [Bet, Pull, User] = useApi([Bet, Pull, User])

  const [checking, setChecking] = React.useState(true);
  const [lastpath, setLastpath] = React.useState('');

  // 获取余额
  const getBalance = React.useCallback(
    () => {
      if (memberStore.j9Reloading) {
        return;
      }
      if (memberStore.isLoged) {
        memberStore.j9Reloading = true
        user.userBalance({target: BalanceTarget.SABA_API})
          .then(({targetBalance}: any) => {
            memberStore.j9Balance.targetBalance = targetBalance
          }).finally(() => {
          memberStore.j9Reloading = false
        })
      }
    },
    [user, memberStore]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  // 监听路由变化
  React.useEffect(
    () => {
      // 设置当前是否为串关
      const filterParam  = new URLSearchParams(location.search).get('filter');
      const filter = filterParam ? JSON.parse(filterParam) : undefined;
      appStore.combo = (
        /^\/parlay/i.test(location.pathname)
        ||
        filter?.matchState === StateExtra.COMBO
      );

      // 用户行为统计上报 (普通浏览)
      let loadTime = undefined;
      let renderTime = undefined;
      if (!lastpath && window.performance?.timing) {
        try {
          loadTime = (
            window.performance.timing.domContentLoadedEventEnd
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
      collect({
        type: CollectType.SURFING,
        loadTime,
        renderTime
      });

      if (location.pathname !== lastpath) {
        window.scrollTo(0, 0);
        setLastpath(location.pathname);
        if (lastpath) {
          // 设置为非首次
          appStore.firstRoute = false;
        }
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

        let nbToken = params.get('token') || memberStore.nbToken;
        const agToken = params.get('j9Token') || memberStore.agToken;
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
        if (origin) {
          appStore.origin = origin;
        }
        // 如果参数中没有origin并且appStore的orgin也为空, 则需要从接口查询主站域名
        else if (!appStore.origin) {
          pull.getOrigin().then(({ domain }: any) => {
            appStore.mainSiteDomain = domain;
          });
        }
        

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
          // 如果nbToken和agToken都是空则表示未登录
          if (!nbToken && !agToken) {
            return;
          }
          try {
            // 如果从主站跳转过来,只带了主站用户token,需要根据主站token先获取体育站token
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
            // 查询用户九游体育厅中余额(SHABA_API)
            const userBalance = await user.userBalance({
              target: (
                (
                  location.pathname.includes('/other/')
                  ||
                  location.pathname === '/tab/member'
                )
                ? undefined
                : BalanceTarget.SABA_API
              )
            });

            // 未找到用户登录信息
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
            if (userBalance.totalBalance < 10) {
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
          // pull.getSettings()
        ]).then(([ids, setttings]) => {
          memberStore.setFavs(ids);
          // if (setttings) {
          //   appStore.setSettings({
          //     acceptAmount: setttings.stake,
          //     locale: setttings.language || DEFAULT_LOCALE,
          //     oddsAccept: setttings.accept,
          //     theme: setttings.theme,
          //     goalSound: setttings.goalNotify
          //   });
          // }
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


  // 只触发一次
  React.useEffect(
    () => {
      // 设置页面title
      document.title = intl.formatMessage({id: 'common.org'})
      // 全局toast消息
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

        const fn = toastMap[type];
        if (fn) {
          fn(detail.content);
        }
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

  // 获取余额
  React.useEffect(
    () => {
      if (!/(^(\/tab)?\/member)|(^\/other)/i.test(location.pathname)) {
        getBalance()
      }
    },
    [memberStore.reloadVersion]
  );

  // 正在加载系统状态显示为loading
  if (checking) {
    return (<LoadingBar style={{ height: '100vh' }} />);
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
              memberStore.creditTransfering = false;
            }}
            balance={memberStore.j9Balance}
            fromInit
          />
        )
      }
    </>
  );
}

export default observer(AppInitial);
