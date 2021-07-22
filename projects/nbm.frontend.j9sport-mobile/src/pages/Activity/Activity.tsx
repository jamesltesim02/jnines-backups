import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageDetail from "./EuropeCup/EuropeCupPages/EuropeDetail";

/** 欧洲杯活动页 */
const PageEuropeCup = lazy(() => import('./EuropeCup'))
const PageEuropeDetail = lazy(() => import('./EuropeCup/EuropeCupPages/EuropeDetail'))

function Activity() {
  return (
    <Switch>
      <Route path="/activity/europe-cup"><PageEuropeCup/></Route>
      <Route path="/activity/detail/:GameID" component={PageEuropeDetail} />

    </Switch>
  );
}

export default Activity;