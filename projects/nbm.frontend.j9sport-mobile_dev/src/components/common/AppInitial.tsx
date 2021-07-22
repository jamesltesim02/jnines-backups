import React from 'react';
import { observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { Toast } from 'antd-mobile';

import { useApi } from '../../apis';
import Bet from '../../apis/Bet';
import Pull from '../../apis/Pull';

import appStore from '../../stores/app';
import memberStore from '../../stores/member';

import LoadingBar from './LoadingBar';
import Error403 from '../../pages/Error/Error403';
import Error503 from '../../pages/Error/Error503';
import { StateExtra } from '../../consts/match';

import collect, { CollectType } from '../../utils/collect';

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

  const [bet, pull]: [Bet, Pull] = useApi([Bet, Pull])

  const [checking, setChecking] = React.useState(true);
  const [lastpath, setLastpath] = React.useState('');
  /* eslint-disable react-hooks/exhaustive-deps */
  // 监听路由变化
  React.useEffect(
    () => {
      // 设置为非首次
      appStore.firstRoute = false;
      // 设置当前是否为串关
      const filterParam  = new URLSearchParams(location.search).get('filter');
      const filter = filterParam ? JSON.parse(filterParam) : undefined;
      appStore.combo = (
        /^\/parlay/i.test(location.pathname)
        ||
        filter?.matchState === StateExtra.COMBO
      );
      
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

      // 用户行为统计上报 (普通浏览)
      collect({
        type: CollectType.SURFING,
        loadTime,
        renderTime
      });

      if (location.pathname !== lastpath) {
        window.scrollTo(0, 0);
        setLastpath(location.pathname);
      }
    },
    [location, setLastpath]
  );
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    () => {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const token = params.get('token') || memberStore.token;
      const clientType = params.get('clientType');
      const origin = params.get('origin');

      appStore.queryString = search;

      const ct = Number(clientType);
      if (ct) {
        appStore.clientType = ct;
      }
      appStore.origin = origin;

      Promise.all([
        new Promise((resolve: (value?: any) => void) => {
          pull.getSystemState()
            .catch(() => {})
            .finally(resolve);
        }),
        new Promise((resolve: (value?: any) => void) => {
          if (!token) {
            return resolve();
          }

          bet.getBalance(token).then(
            result => {
              if (!result || !result.customerId) {
                memberStore.memberInfo = null;
                return;
              }
              console.log(`账号: ${result.customerId}, 余额: ${result.balance}`);
              memberStore.memberInfo = {
                userId: result.nbUserId,
                token: token,
                customerId: result.customerId,
                balance: result.balance,
                currency: result.currency
              };
              // 查询已收藏比赛
              pull.getFavIds().then(
                memberStore.setFavs.bind(memberStore)
              );
            }
          ).finally(resolve);
        })
      ]).finally(
        () => setChecking(false)
      )
    },
    [pull, bet]
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

      return () => {
        window.removeEventListener('toast', handleToastEvent);
        window.removeEventListener('error', handleError);
      };
    },
    [intl]
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

  return children;
}

export default observer(AppInitial);
