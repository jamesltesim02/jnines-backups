import React from 'react';
import { observer } from "mobx-react";
import { Link } from 'react-router-dom';

import AppConfig from '../../../configs';
import memberStore from "../../../stores/member";
import appStore from "../../../stores/app";
import { useApi } from "../../../apis";
import User from "../../../apis/User";
import { BalanceTarget } from "../../../apis/User";

import LogoImage from '../../../assets/images/logo.png';
import loginImg from '../../../components/common/AppHeader/images/login.png';

import M from '../../../components/common/m';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../../components/common/LoadingBar';

import refreshImg from '../../../components/common/AppHeader/images/refresh.png';

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
        onlyRead: true
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
        el.src = 'https://bifrost.oddin.gg/script.js';
        document.body.appendChild(el);
      }).then(() => {
        win.oddin.buildBifrost({
          brandToken: AppConfig.ODDIN_BRAND_TOKEN,
          baseUrl: AppConfig.ODDIN_URL,
          customDomain: winTop.location.hostname,
          language: appStore.locale,
          token: memberStore.memberInfo?.nbToken,
          currency: CURRENCY_MAP[memberStore.currency],
          contentElement: "#oddinContainer",
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
          <img
            src={LogoImage}
            className="logo"
            alt=""
          />
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
                  : <img
                      src={refreshImg}
                      className="refresh"
                      alt=""
                    />
                }
              </button>
            </span>
          ) : (
            <Link
              className="to-login"
              to="/login"
            >
              <img src={loginImg} alt=""/>
              <M id="common.login"/>
            </Link>
          )
        }
      </header>
      <div id="oddinContainer"></div>
      {
        loading
        ? <LoadingBar className="full" />
        : undefined
      }
    </div>
  );
}

export default observer(Oddin);