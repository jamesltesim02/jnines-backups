import React from 'react';
import { Link } from 'react-router-dom'
import mergeClass from "../../../utils/mergeClass";
import { Redirect, Route, Switch, useLocation } from "react-router";

import PageMine from "./EuropeCupPages/EuropeMine";
import PageBest from "./EuropeCupPages/EuropeBest";
import PageGroup from "./EuropeCupPages/EuropeGroup";
import PageIntegral from "./EuropeCupPages/EuropeIntegral";
import PageDetail from "./EuropeCupPages/EuropeDetail";
import PageSingle from "./EuropeCupPages/EuropeSingle";

const EUR_URL = '/activity/europe-cup'

const NavList = [
  {
    name: '单场竞猜',
    url: '/single',
    com: PageSingle
  },
  {
    name: '小组竞猜',
    url: '/group',
    com: PageGroup
  },
  {
    name: '夺冠及最佳',
    url: '/best',
    com: PageBest
  },
  {
    name: '积分数据',
    url: '/integral',
    com: PageIntegral
  },
  {
    name: '我的竞猜',
    url: '/mine',
    com: PageMine
  },
]

function EuropeCup() {
  const location = useLocation()

  return (
    <div className="europe-cup">
      <div className="europe-cup-container">
        <nav className="europe-nav main">
          {
            NavList.map((item) => {
              return (
                <Link
                  key={item.url}
                  className={mergeClass({
                    'active': location.pathname.includes(EUR_URL + item.url)
                  })}
                  to={EUR_URL + item.url}
                >
                  {item.name}
                </Link>
              )
            })
          }
        </nav>
          <Switch>
            <Route exact path="/activity/europe-cup">
              <Redirect to="/activity/europe-cup/single" />
            </Route>
            <Route path="/activity/europe-cup/single/detail/:GameID" component={PageDetail} />
            {
              NavList.map((item) => (
                <Route key={item.url} path={EUR_URL + item.url} component={item.com} />
              ))
            }
          </Switch>
      </div>
    </div>
  );
}

export default EuropeCup;