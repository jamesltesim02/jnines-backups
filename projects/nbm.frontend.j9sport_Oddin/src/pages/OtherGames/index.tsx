import React from 'react';
import {Switch, Route} from 'react-router-dom';
import './index.less'

import SportsBar from "../../components/matchs/SportsBar/SportsBar";

import Oddin from "./Oddin/index";
import Ysb from "./Ysb";
import Shaba from "./Shaba";

function OtherGames() {
    return (
        <div className="other-games">
            <SportsBar />
            <Switch>
                <Route path="/other/oddin"><Oddin /></Route>
                <Route path="/other/ysb"><Ysb /></Route>
                <Route path="/other/shaba"><Shaba /></Route>
            </Switch>
        </div>
    );
}

export default OtherGames;