import React from 'react';
import { Link } from 'react-router-dom'
import { Redirect, Route, Switch, useLocation } from "react-router";
import mergeClass from "../../../utils/mergeClass";
import AppHeader from "../../../components/common/AppHeader/AppHeader";

import PageMine from "./EuropeCupPages/EuropeMine";
import PageBest from "./EuropeCupPages/EuropeBest";
import PageGroup from "./EuropeCupPages/EuropeGroup";
import PageIntegral from "./EuropeCupPages/EuropeIntegral";
import PageSingle from "./EuropeCupPages/EuropeSingle";

const EUR_URL = '/activity/europe-cup'

const Rule = () => {
  return (
    <div className="europe-rule">
      <div className="europe-rule-content">
        <br/>
        1. 所有竞猜游戏的赛果，唯一参考结算标准为欧足联-欧洲杯官方网址数据（
        <a
          target={"_blank"}
          href="https://www.uefa.com/uefaeuro-2020">https://www.uefa.com/uefaeuro-2020/
        </a>
        ）
        <br/>
        2. 单场比赛竞猜的全部游戏，竞猜选项为90分钟常规上下半场的结果，不包含加时赛和点球大战。
        <br/>
        3.
        最佳射手竞猜，如果出现进球数相同、并列最佳射手的情况，所竞猜投注获得的奖金，将按照并列最佳射手的人数，等比例降低。比如，竞猜奖金赔率为10倍，有2名并列最佳射手，则最终返奖为5倍(10/2)；如有3名并列最佳射手，则最终返奖为3.33倍(10/3)，以此类推。
        <br/>
        4.竞猜提供赔率更优越，投注不参与优惠活动。
      </div>
    </div>
  )
}

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
  {
    name: '竞猜规则',
    url: '/rule',
    com: Rule
  },
]

function EuropeCup() {
  const location = useLocation()

  return (
    <div>
      <AppHeader />
      <div className="europe-cup">
        {/*<img src={ImageEuropeBgc} alt=""/>*/}
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
            {
              NavList.map((item) => (
                <Route key={item.url} path={EUR_URL + item.url} component={item.com} />
              ))
            }
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default EuropeCup;