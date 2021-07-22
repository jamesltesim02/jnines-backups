import React from 'react'
import { Switch, useLocation, Route } from 'react-router-dom'

import Top1Page from './top1'
import WelcombackPage from './welcomeback'
import ExperiencePage from './experience'

const PromotionsPage = () => {
  const location = useLocation()

  return (
    <Switch location={location}>
      <Route path="/promotions/top1"><Top1Page /></Route>
      <Route path="/promotions/welcomeback"><WelcombackPage /></Route>
      <Route path="/promotions/experience"><ExperiencePage /></Route>
    </Switch>
  )
}

export default PromotionsPage
