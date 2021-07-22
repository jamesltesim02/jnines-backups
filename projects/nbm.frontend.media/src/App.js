import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

import './assets/common.css'

import VideoPage from './pages/video'
import LmtPage from './pages/lmt'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><Redirect to="/lmt" /></Route>
        <Route path="/video"><VideoPage /></Route>
        <Route page="/lmt"><LmtPage /></Route>
      </Switch>
    </Router>
  )
}

export default App
