import React from 'react';
import { Route, Switch } from 'react-router';

// 账户设置
const ProfileSettings = React.lazy(() => import('../ProfileSettings'));
// 验证手机号
const VerifyPhone = React.lazy(() => import('./VerifyPhone'));
// 谷歌验证器
const VerifyGoogle = React.lazy(() => import('./VerifyGoogle'));
// 更改手机
const ChangePhone = React.lazy(() => import('./ChangePhone'));
// 更改密码
const ChangePassword = React.lazy(() => import('./ChangePassword'));
// 更改密码
const CreditPassword = React.lazy(() => import('./CreditPassword'));

function ProfileSettingsRoute() {
  return (
    <Switch>
      <Route path={'/member/profile-settings/verify-phone'}><VerifyPhone /></Route>
      <Route path={'/member/profile-settings/change-phone'}><ChangePhone /></Route>
      <Route path={'/member/profile-settings/change-password'}><ChangePassword /></Route>
      <Route path={'/member/profile-settings/verify-google'}><VerifyGoogle /></Route>
      <Route path={'/member/profile-settings/credit-password'}><CreditPassword /></Route>
      <Route path={'/member/profile-settings'}><ProfileSettings /></Route>
    </Switch>
  );
}

export default ProfileSettingsRoute;