import React from 'react';
import { Route, Switch } from 'react-router';

import MemberLayout from "../../../components/member/MemberLayout";

const Settings = React.lazy(() => import('../Settings'));
const Change = React.lazy(() => import('./Password'));
const Google = React.lazy(() => import('./Google'));

function SettingsRoute() {
  return (
    <MemberLayout
      title={"账户设置"}
      subTitle={"ACCOUNT SETTINGS"}
      className="settings"
    >
      <Switch>
        <Route path="/member/settings/change"><Change /></Route>
        <Route path="/member/settings/google"><Google /></Route>
        <Route path="/member/settings"><Settings /></Route>
      </Switch>
    </MemberLayout>
  );
}

export default SettingsRoute;