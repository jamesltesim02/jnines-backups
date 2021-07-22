import React from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import { useLocation } from 'react-router'

import MainPage from './main'
import SportPage from './sport-page'

import Cart from '../../../components/cart'

const HomePage = () => {
  const location = useLocation()

  return (
    <>
      <Switch location={location}>
        <Route path="/tab/home/main"><MainPage /></Route>
        <Route path="/tab/home/:sport/:state"><SportPage /></Route>
        <Route path="/tab/home/:sport"><SportPage /></Route>
      </Switch>
      <Cart intabs />
    </>
  )
}

export default HomePage