import React from 'react';
import {Switch, Route} from 'react-router-dom';
import './index.less'

import Oddin from "./Oddin/index";
import Ysb from "./Ysb";
import Shaba from "./Shaba";

function OtherGames() {
    return (
      <Switch>
          <Route path="/other/esport"><Oddin /></Route>
          <Route path="/other/ysb"><Ysb /></Route>
          <Route path="/other/shaba"><Shaba /></Route>
      </Switch>
    );
}

export default OtherGames;