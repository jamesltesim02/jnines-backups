import React from 'react';
import { observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';

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

function AppInitial (
  {
    api: {
      bet,
      pull
    },
    children
  }: {
    api: {
      bet: Bet,
      pull: Pull,
    },
    children: any
  }
) {
  const { systemState } = appStore;

  const intl = useIntl();
  const location = useLocation();
  const [checking, setChecking] = React.useState(true);

  // 监听路由变化
  React.useEffect(
    () => {
      appStore.firstRoute = false;
    },
    [location]
  );

  // 
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
              // 查询用户配置信息
              return pull.getSettings();
            }
          ).then(
            result => {
              if (!result) {
                return;
              }
              appStore.setSettings({
                acceptAmount: result.stake,
                locale: result.language,
                oddsAccept: result.accept,
                theme: result.theme,
                goalSound: result.goalNotify
              });
            }
          ).finally(resolve);
        })
      ]).finally(
        () => setChecking(false)
      )
    },
    [pull, bet]
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
      window.addEventListener('toast', handleToastEvent);
      return () => window.removeEventListener('toast', handleToastEvent);
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

  return children;
}

export default withApi({
  bet: Bet,
  pull: Pull
})(
  observer(AppInitial)
);
