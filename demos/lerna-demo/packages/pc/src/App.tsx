import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import AboutUS from './pages/AboutUS';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">HOME</Link>
            |||||||
            <Link to="/about">ABOUT US</Link>
          </nav>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Switch>
            <Route exact path="/">
              <Index />
            </Route>
            <Route path="/about"><AboutUS /></Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
