import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router';

import memberStore from '../../stores/member';
import MemberInfo from '../../components/member/MemberInfo';
import { observer } from 'mobx-react';
import Verification from '../../components/member/Verification';

const Recharge = React.lazy(() => import('./Recharge'));
const Wallet = React.lazy(() => import('./Wallet'));
const Withdrawal = React.lazy(() => import('./Withdrawal'));
const SettingsRoute = React.lazy(() => import('./Settings/SettingsRoute'));
const Rules = React.lazy(() => import('../Rules'));
const Ticket = React.lazy(() => import('../Ticket'));
const Transaction = React.lazy(() => import("./Transaction"));
const WashCode = React.lazy(() => import("./WashCode"));

function Member () {
  const history = useHistory();

  if (!memberStore.isLoged) {
    history.replace('/home');
    return null;
  }
  return (
    <section className="member-page">
      {/* 左边菜单栏 */}
      <div className="left">
        <MemberInfo />
      </div>
      {/* 右边具体内容 */}
      <div className="right">
        <Switch>
          <Route exact path="/member/">
            <Redirect to="/member/settings" />
          </Route>
          {/* 存款 */}
          <Route path="/member/recharge"><Recharge /></Route>
          {/* 取款 */}
          <Route path="/member/withdrawal"><Withdrawal /></Route>
          {/* 我的钱包 */}
          <Route path="/member/wallet"><Wallet /></Route>
          {/*账户设置*/}
          <Route path="/member/settings"><SettingsRoute /></Route>
          {/*玩法规则*/}
          <Route path="/member/rules"><Rules /></Route>
          {/*我的注单*/}
          <Route path="/member/orders"><Ticket /></Route>
          {/*交易记录*/}
          <Route path="/member/amount-records"><Transaction /></Route>
          {/*游戏洗码*/}
          <Route path="/member/wash-code"><WashCode /></Route>
        </Switch>
      </div>
    </section>
  );
}

export default observer(Member);
