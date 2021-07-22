import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import Tabbar from '../../components/common/Tabbar';

import HomePage from './Home';
import InplayPage from './Inplay';
import DiscoverPage from './Discover';
import MemberPage from './Member';

import matchStore from '../../stores/matchs';
import cartStore from '../../stores/cart';
import { observer } from "mobx-react";
import { ExtraMenu } from "../../consts/match";

function Tabs() {
  const routes = [
    {
      name: 'home',
      path: '/tab/home',
      component: HomePage
    },
    {
      name: 'inplay',
      path: '/tab/inplay',
      component: InplayPage,
      count: matchStore.getCount(ExtraMenu.INPLAY)
    },
    {
      name: 'discover',
      path: '/tab/discover',
      component: DiscoverPage
    },
    {
      name: 'member',
      path: '/tab/member',
      component: MemberPage,
      count: cartStore.ticketCountTip
    },
  ];
  const location = useLocation();
  return (
    <>
      <div className="tab-page">
        <Switch>
          {
            routes.map(route => {
              const Component = route.component;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                >
                  <Component />
                </Route>
              )
            })
          }
        </Switch>
      </div>
      <Tabbar
        tabs={routes.map(({component, ...tab}) => tab)}
        active={location.pathname}
      />
    </>
  );
}

export default observer(Tabs);
