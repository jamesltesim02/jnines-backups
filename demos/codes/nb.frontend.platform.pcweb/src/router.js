import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Match from './views/Match';
import ToMatch from './views/Match/ToMatch';
import TourMatchs from './views/TourMatchs';
import Detail from './views/Detail';
import Blockade from './views/Blockade';
import Jackpot from './views/Jackpot';
import Result from './views/Result';
import Error from './views/Error';

import XSports from './views/XSports';
import MatchDetail from './views/XSports/MatchDetail';
import FinishedDetail from './views/XSports/FinishedDetail';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/xsports',
    },
    {
      path: '/xsports',
      redirect: '/xsports/1',
    },
    {
      path: '/xsports/:state',
      name: 'xsports',
      component: XSports,
      props: route => ({ state: +route.params.state }),
    },
    {
      path: '/detail/:sno/:mid',
      name: 'detail',
      component: MatchDetail,
      props: true,
    },
    {
      path: '/finished/:sno/:mid',
      name: 'finished',
      component: FinishedDetail,
      props: true,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/tomatchs/:sno',
      name: 'tomatchs',
      component: ToMatch,
      props: route => ({ sno: +route.params.sno }),
    },
    {
      path: '/matchs/:sno/:state',
      name: 'matchs',
      component: Match,
      props: route => ({
        sno: +route.params.sno,
        state: +route.params.state,
      }),
    },
    {
      path: '/tour/:sno/:tourid',
      name: 'tourmatchs',
      component: TourMatchs,
      props: route => ({
        sno: +route.params.sno,
        tourid: route.params.tourid,
      }),
    },
    {
      path: '/detail/:sno/:mid',
      name: 'detail',
      component: Detail,
      props: route => ({
        sno: +route.params.sno,
        mid: route.params.mid,
      }),
    },
    {
      path: '/blockade',
      name: 'blockade',
      component: Blockade,
    },
    {
      path: '/jackpot',
      name: 'jackpot',
      component: Jackpot,
    },
    {
      path: '/result',
      name: 'result',
      component: Result,
    },
    {
      path: '/error/:code',
      name: 'error',
      component: Error,
      props: true,
    },
    {
      path: '*',
      redirect: '/error/404',
    },
  ],
});
