import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'antd/dist/antd.less';
import './assets/styles/common.less';

import LocaleProvider from './components/common/LocaleProvider';

import Signin from './pages/Signin';
import AppLayout from './pages/AppLayout';

function App () {
  return (
    <LocaleProvider>
      <Router>
        <Switch>
          <Route path="/signin"><Signin /></Route>
          <Route path="/"><AppLayout /></Route>
        </Switch>
      </Router>
    </LocaleProvider>
  )
}

export default App
