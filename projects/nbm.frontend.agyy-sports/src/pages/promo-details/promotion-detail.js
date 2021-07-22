import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import RedEnvelope from './red-envelope';
import CommonDetail from './common-detail'

function PromotionDetail () {
  const location = useLocation()
  return (
    <Switch location={location}>
      <Route path="/promo-detail/red-envelope"><RedEnvelope /></Route>
      <Route path="/promo-detail/:pid"><CommonDetail /></Route>
    </Switch>
  );
}

export default PromotionDetail;
