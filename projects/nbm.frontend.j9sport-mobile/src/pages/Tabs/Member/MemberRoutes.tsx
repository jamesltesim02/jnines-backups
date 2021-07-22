import React from 'react';
import { Route, Switch } from 'react-router';
import ProfileSettingsRoute from "./ProfileSettings/ProfileSettingsRoute";

import memberStore from '../../../stores/member';
import { Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

// 充值
const Recharge = React.lazy(() => import('./Recharge'));
// USDT 买币向导
const UsdtGuide = React.lazy(() => import('./Recharge/UsdtGuide'));
// 我的钱包
const Wallet = React.lazy(() => import('./Wallet'));
// 取款
const Withdrawal = React.lazy(() => import('./Withdrawal'));
// 洗码
const WashCode = React.lazy(() => import('./WashCode'))
// 洗码优惠规则
const WashCodePromo = React.lazy(() => import('./WashCode/WashCodePromo'))

function MemberRoute () {
  const intl = useIntl()
  const history = useHistory();

  if (!memberStore.isLoged) {
    Toast.info(intl.formatMessage({id: 'common.sign_first'}),)
    setTimeout(() => history.replace("/login"), 1500)
    return null;
  }

  return (
    <Switch>
      {/* 充值 */}
      <Route path="/member/recharge"><Recharge /></Route>
      {/* USDT购买向导 */}
      <Route path="/member/usdt-guide"><UsdtGuide /></Route>
      {/* 账户设置 */}
      <Route path="/member/profile-settings"><ProfileSettingsRoute /></Route>
      {/* 我的钱包 */}
      <Route path="/member/wallet"><Wallet /></Route>
      {/* 取款 */}
      <Route path="/member/withdrawal"><Withdrawal /></Route>
      {/* 洗码 */}
      <Route path="/member/wash-code"><WashCode /></Route>
      {/* 洗码优惠规则 */}
      <Route path="/member/wash-code-promo"><WashCodePromo /></Route>
    </Switch>
  );
}

export default MemberRoute;