import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';

import { AVAILABLE_SPORTS, Sports, SportType } from '../../consts/match';

import SportsBar from '../../components/matchs/SportsBar';
import DefaultPage from './Default';
import FavoritePage from './Favorite';
import ParleyPage from './Parley';
import InplayPage from './Inplay';
import SportPage from './Sport';
import RightBar from '../../components/matchs/RightBar';

import appStore from '../../stores/app';
import { observer } from 'mobx-react';
import mergeClass from '../../utils/mergeClass';
import { Locales } from '../../consts/app';

function HomePage () {

  const location = useLocation();
  const sid = Number(location.pathname.split('/')[2]) as SportType;

  return (
    <div className={mergeClass({
      'home-page': true,
      'english': appStore.locale === Locales.EN_US
    })}>
      <SportsBar />
      <Switch>
        <Route path="/home/-1"><FavoritePage /></Route>
        <Route path="/home/1"><ParleyPage /></Route>
        <Route path="/home/2"><InplayPage /></Route>
        <Route path="/home/:sport"><SportPage /></Route>
        <Route path="/home/"><DefaultPage /></Route>
      </Switch>
      <RightBar
        showLive
        sportId={
          sid ? (
            AVAILABLE_SPORTS.includes(sid)
            ? sid
            : undefined
          ) : Sports.SOCCER
        }
      />
    </div>
  );
}

export default observer(HomePage);
