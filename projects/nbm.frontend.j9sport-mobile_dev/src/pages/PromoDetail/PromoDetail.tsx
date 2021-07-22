import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CommonDetail from './CommonDetail';
import RedEnvelope from './RedEnvelope';

function PromoDetail () {
  return (
    <Switch>
      <Route path="/promo-detail/red-envelope"><RedEnvelope /></Route>
      <Route path="/promo-detail/:pid"><CommonDetail /></Route>
    </Switch>
  );
}

export default PromoDetail;
