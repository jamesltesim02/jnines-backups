import React from 'react';
import { observer } from "mobx-react";
import { SyncOutlined } from '@ant-design/icons';

import AppConfig from '../../../configs';
import memberStore from "../../../stores/member";
import appStore from "../../../stores/app";

import AppFooter from '../../../components/common/AppFooter';

import Logo from '../../../components/common/AppHeader/Logo';
import M from '../../../components/common/m';
import { useApi } from '../../../apis';
import User, { BalanceTarget } from '../../../apis/User';
import LoadingBar from '../../../components/common/LoadingBar';
import mergeClass from '../../../utils/mergeClass';

const CURRENCY_MAP = {
  1: 'CNY',
  2: 'USD',
  101: 'CNY'
} as any;

/**
 * ### Oddin回调事件名
 * * LOADED - 页面加载完成
 * * ERROR - 页面发生错误
 * * REQUEST_SIGN_IN - 需要重新登录
 * * REQUEST_REFRESH_BALANCE - 需要刷新余额
 */
enum OddinEvent {
  /** 页面加载完成 */
  LOADED = 'LOADED',
  /** 页面发生错误 */
  ERROR = 'ERROR',
  /** 需要重新登录 */
  REQUEST_SIGN_IN = 'REQUEST_SIGN_IN',
  /** 需要刷新余额 */
  REQUEST_REFRESH_BALANCE = 'REQUEST_REFRESH_BALANCE',
}

const winTop = window.top || window

function Oddin() {
  const { user }: { user: User } = useApi({ user: User });

  const [loading, setLoading] = React.useState(true);
  const [balanceLoading, setBalanceLoading] = React.useState(true);
  const [balance, setBalance] = React.useState(0);
  const queryBalance = React.useCallback(
    () => {
      setBalanceLoading(true);
      user.userBalance({
        target: BalanceTarget.SPORT,
        onlyRead: true,
      }).then(
        (result) => setBalance(result.targetBalance)
      ).finally(
        () => setBalanceLoading(false)
      )
    },
    [user]
  );

  React.useEffect(
    () => {
      const win: any = window;
      new Promise<void>((resolve, reject) => {
        if (win.oddin) {
          resolve();
        }
        const el = document.createElement('script');
        el.addEventListener('load', () => resolve());
        el.src = `${AppConfig.ODDIN_URL}script.js`;
        document.body.appendChild(el);
      }).then(() => {
        win.oddin.buildBifrost({
          brandToken: AppConfig.ODDIN_BRAND_TOKEN,
          baseUrl: AppConfig.ODDIN_URL,
          customDomain: winTop.location.hostname,
          language: appStore.locale,
          token: memberStore.memberInfo?.nbToken,
          currency: CURRENCY_MAP[memberStore.currency],
          contentElement: '#oddinContainer',
          eventHandler: (
            event: {
              /** 事件类型 */
              type: OddinEvent,
              /** 错误内容(通常是错误code) */
              error?: number
            }
          ) => {
            switch (event.type) {
              // 页面加载完成
              case OddinEvent.LOADED:
                setLoading(false);
                break;
              // 重新加载余额
              case OddinEvent.REQUEST_REFRESH_BALANCE:
                queryBalance()
                break;
              default: ;
            }
          }
        });
      })

      if (memberStore.isLoged) {
        queryBalance();
        window.addEventListener('focus', queryBalance);
      } else {
        setBalanceLoading(false);
      }

      return () => window.removeEventListener('focus', queryBalance);
    },
    [memberStore.isLoged]
  );

  return (
    <div
      className={mergeClass({
        'oddin-game-container': true,
        loading
      })}
    >
      <header>
        <a href="/">
          <Logo />
        </a>
        <i className="holder" />
        {
          memberStore.isLoged ? (
            <span>
              游戏额度: {
                balanceLoading
                ? '***.**'
                : balance
              } {
                CURRENCY_MAP[memberStore.currency]
              }
              <button
                className={mergeClass({
                  'btn-reload': true,
                  'available': !balanceLoading,
                })}
                onClick={
                  balanceLoading
                  ? undefined
                  : queryBalance
                }
              >
                {
                  balanceLoading
                  ? <LoadingBar />
                  : <SyncOutlined />
                }
              </button>
            </span>
          ) : (
            <div className="signin-options">
              <a
                className="btn-login"
                href="/?accountModal=login"
              >
                <M id="pages.signin"/>
              </a>
              <a href="/?accountModal=register"><M id="pages.signup"/></a>
            </div>
          )
        }
      </header>
      <div id="oddinContainer"></div>
      <AppFooter />
      {
        loading
        ? <LoadingBar className="page-loading" />
        : undefined
      }
    </div>
  );
}

export default observer(Oddin);