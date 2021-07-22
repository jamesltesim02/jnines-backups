import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageStructure from "../../components/common/PageStructure";

/** 欧洲杯活动页 */
const PageEuropeCup = lazy(() => import('./EuropeCup'))

function Activity() {
  return (
    <PageStructure>
      <Switch>
        <Route path="/activity/europe-cup"><PageEuropeCup/></Route>
      </Switch>
    </PageStructure>
  );
}

export default Activity;