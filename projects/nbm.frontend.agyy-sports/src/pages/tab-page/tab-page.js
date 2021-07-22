import React from 'react'
import { inject, observer } from 'mobx-react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'

import { MODE_SIZE } from '../../utils/get-flexible-mode'

import Tabbar from '../../components/common/tabbar'

import HomePage from './home'
import ScorePage from './score'
import LivePage from './live'
import OrdersPage from './orders'
import InPlayPage from './in-play'

const TabPage = ({
  store: { app }
}) => {
  const location = useLocation()

  return (
    <>
      <Switch location={location}>
        <Route exact path="/tab/home/"><Redirect to="/tab/home/main" /></Route>
        <Route path="/tab/home/"><HomePage /></Route>
        <Route path="/tab/score/:sport"><ScorePage /></Route>
        <Route path="/tab/score"><Redirect to="/tab/score/10" /></Route>
        <Route path="/tab/live"><LivePage /></Route>
        <Route path="/tab/inPlay/:sportParam"><InPlayPage /></Route>
        <Route path="/tab/inPlay"><InPlayPage /></Route>
        <Route path="/tab/orders"><OrdersPage /></Route>
        <Route path="/tab/"><Redirect to="/tab/home/main" /></Route>
      </Switch>
      {
        app.docWidth < MODE_SIZE.medium.min
        ? <Tabbar />
        : null
      }
    </>
  )
}

export default inject('store')(
  observer(TabPage)
)
