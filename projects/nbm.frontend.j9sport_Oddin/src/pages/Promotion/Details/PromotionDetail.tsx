import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PageStructure from '../../../components/common/PageStructure';
// import Error404 from '../../Error/Error404';

import RedEnvelope from './RedEnvelope';
import CommonDetail from './Common';

function PromotionDetail () {
  return (
    <PageStructure>
      <Switch>
        <Route path="/promo-detail/red-envelope"><RedEnvelope /></Route>
        <Route path="/promo-detail/:pid"><CommonDetail /></Route>
        {/* <Route path="*"><Error404 /></Route> */}
      </Switch>
    </PageStructure>
  );
}

export default PromotionDetail;
