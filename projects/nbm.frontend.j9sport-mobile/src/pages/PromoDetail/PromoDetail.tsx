import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CommonDetail from './CommonDetail';
import RedEnvelope from './RedEnvelope';
import Eurocup21Prizepool from './Eurocup21Prizepool';
import HeroLeaderboard from './HeroLeaderboard';
import BonusReward from "./BonusReward";

function PromoDetail () {
  return (
    <Switch>
      <Route path="/promo-detail/red-envelope"><RedEnvelope /></Route>
      <Route path="/promo-detail/european-cup"><Eurocup21Prizepool /></Route>
      <Route path="/promo-detail/hero-leaderboard"><HeroLeaderboard /></Route>
      <Route path="/promo-detail/bonus-reward"><BonusReward /></Route>
      <Route path="/promo-detail/:pid"><CommonDetail /></Route>
    </Switch>
  );
}

export default PromoDetail;
