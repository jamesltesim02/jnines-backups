import React, {useState} from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { message } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';

import mergeClass from '../../../../utils/mergeClass';
import memberStore from '../../../../stores/member';
import CartStore from '../../../../stores/cart/Cart';

import M from '../../m';
import Preference from './Preference';
import { useIntl } from 'react-intl';
import { toDeposit, toMember, toSignin } from '../../../../utils/MainSiteUtils';
import { withApi } from '../../../../apis';
import Bet from '../../../../apis/Bet';
import LocaleSwitcher from './LocaleSwitcher';

const CURRENCY_MAP: any = {
  1: '¥',
  2: '$',
  101: '¥'
};

/* eslint-disable jsx-a11y/anchor-is-valid */
function Options(
  {
    api: { bet }
  }: {
    api: { bet: Bet }
  }
) {
  const intl = useIntl();
  const [preferenceVisible, setPreferenceVisible] = useState(false);

  const {
    username,
    currency,
    balance,
    isLoged,
    reloadVersion
  } = memberStore;

  const [checking, setChecking] = useState(false);
  const { ticketCount } = CartStore;

  React.useEffect(
    () => {
      if (
        !memberStore.isLoged
        ||
        reloadVersion === 1
      ) {
        return;
      }
      setChecking(true);
      bet.getBalance(memberStore.token).then(
        result => {
          if (!result || !result.customerId) {
            memberStore.memberInfo = null;
            return;
          }
          memberStore.memberInfo = {
            userId: result.nbUserId,
            token: memberStore.token,
            customerId: result.customerId,
            balance: result.balance,
            currency: result.currency
          };
        }
      ).finally(
        () => setChecking(false)
      );
    },
    [bet, reloadVersion]
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
      checking ? (
        <LoadingOutlined />
      ) : (
        <>
          <a
            className="btn"
            onClick={toSignin}
          >
            <M id="pages.signin" />
          </a>
          <a  onClick={toSignin}><M id="pages.signup" /></a>
        </>
      )
    );
  } else {
    memberComps = (
      <>
        <div
          className="userInfo"
          onClick={toMember}
        >{username}</div>
        <div
          className="userInfo"
          onClick={toMember}
        >
          {CURRENCY_MAP[currency]}
          {balance.toFixed(2)}
        </div>
        <button
          className={mergeClass({
            'btn-reload': true,
            loading: checking
          })}
          onClick={() => memberStore.reload()}
        >
          {
            checking
            ? <LoadingOutlined />
            : <ReloadOutlined />
          }
        </button>
        <a
          className="btn"
          onClick={toDeposit}
        ><M id="pages.deposit" /></a>
        <a
          onClick={() => {
            memberStore.memberInfo = null;
            message.success(intl.formatMessage({ id: 'pages.quit_sucecss' }));
          }}
        ><M id="pages.quit" /></a>
      </>
    );
  }

  return (
    <>
      <div className="header-options">
        {
          memberStore.isLoged ? (
            <>
              <div onClick={() => setPreferenceVisible(!preferenceVisible)}>
                <M id="settings.title" />
              </div>
              <LocaleSwitcher />
            </>
          ) :null
        }
        <Link
          to="/specialnote"
        >
          <M id="pages.special_rules" />
        </Link>
        <Link
          to={'/rules'}
        >
          <M id="pages.rules" />
        </Link>
        <Link
          to="/ticket"
          id='options-ticket-link'
        >
          <M id="pages.my_orders" />
        </Link>
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

export default withApi({ bet: Bet })(observer(Options));
