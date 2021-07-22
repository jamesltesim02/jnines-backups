import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Promotions from './Promotions';
import Results from './Results';
import Streams from './Streams';

function Discover () {
  return (
    <Switch>
      <Route path="/tab/discover/promotions">
        <Promotions />
      </Route>
      <Route path="/tab/discover/streams">
        <Streams />
      </Route>
      <Route path="/tab/discover/results">
        <Results />
      </Route>
      <Route path="/tab/discover/">
        <Redirect to="/tab/discover/promotions" />
      </Route>
    </Switch>
  );
}

export default Discover;
