import React from 'react'
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import { useLocation } from "react-router"

import TabBar from '../components/common/tab-bar'

import SportPage from './sport-page'
import IndexPage from './index'

const MatchsPage = () => {
  const location = useLocation()

  return (
    <>
      <TabBar />
      <Switch location={location}>
        <Route path="/matchs/all">
          <IndexPage />
        </Route>
        <Route path="/matchs/:sport">
          <SportPage />
        </Route>
      </Switch>
    </>
  )
}

export default MatchsPage
