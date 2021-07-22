import React from 'react'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { useLocation } from 'react-router'

import Tabbar from '../../components/common/tabbar'

import HomePage from './home'
import ScorePage from './score'
import LivePage from './live'
import OrdersPage from './orders'

const TabPage = () => {
  const location = useLocation()

  return (
    <>
      <Switch location={location}>
        <Route exact path="/tab/home/"><Redirect to="/tab/home/main" /></Route>
        <Route path="/tab/home/"><HomePage /></Route>
        <Route path="/tab/score/:sport"><ScorePage /></Route>
        <Route path="/tab/score"><Redirect to="/tab/score/10" /></Route>
        <Route path="/tab/live"><LivePage /></Route>
        <Route path="/tab/orders"><OrdersPage /></Route>
        <Route path="/tab/"><Redirect to="/tab/home/main" /></Route>
      </Switch>
      <Tabbar />
    </>
  )
}

export default TabPage
