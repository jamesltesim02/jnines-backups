import React, {lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import {StateExtra} from '../../consts/match';
import member from "../../stores/member";

import HomePage from '../Home';
import Results from '../Results';
import TourMatchs from '../TourMatchs';
import Category from '../Category';
import Detail from "../Announcement/Detail";
import SpecialNote from "../SpecialNote";
import Error404 from '../Error/Error404';
import PageStructure from '../../components/common/PageStructure';
import RedEnvelopeAlert from "../../components/promotions/RedEnvelope/RedEnvelopeAlert";
import LoadingBar from "../../components/common/LoadingBar";
import OtherGames from "../OtherGames";

const Promotion = lazy(() => import('../Promotion'))
const RuleContent = lazy(() => import('../Rules'))
const Announcement = lazy(() => import('../Announcement'))
const Ticket = lazy(() => import('../Ticket'))
const MatchDetail = lazy(() => import('../MatchDetail'))

const AppLayout = () => {
  return (
    <PageStructure>
      <section className="content-wrapper">
        <Suspense fallback={<LoadingBar/>}>
          <Switch>
            {/* 根目录直接重定向到home */}
            <Route exact path="/"><Redirect to="/home" /></Route>
            {/* 首页 */}
            <Route path="/home"><HomePage /></Route>
            {/*其他游戏，oddin*/}
            <Route path="/other"><OtherGames /></Route>
            {/* 赛果 */}
            <Route path="/results"><Results matchState={StateExtra.RESULT} /></Route>
            {/* 直播 */}
            <Route path="/live"><Results matchState={StateExtra.LIVE_LIST} /></Route>
            {/* 联赛页 */}
            <Route path="/tours/:sid/:tours"><TourMatchs /></Route>
            {/* 串关比赛详情 */}
            <Route path="/detail/99/:mid"><MatchDetail combo /></Route>
            {/* 滚球比赛详情 */}
            <Route path="/detail/2/:mid"><MatchDetail inplay /></Route>
            {/* 普通比赛详情 */}
            <Route path="/detail/:mid"><MatchDetail /></Route>
            {/* 根据类别查询比赛(顶级联赛, 近12小时) */}
            <Route path="/category/:sid/:category/:name"><Category /></Route>
            {/* 我的注单 */}
            <Route path="/ticket"><Ticket /></Route>
            {/* 优惠列表 */}
            <Route path="/promotions"><Promotion /></Route>
            {/* 公告列表 */}
            <Route path="/announcement"><Announcement /></Route>
            {/* 公告详情 */}
            <Route path="/anno-detail/:id"><Detail /></Route>
            {/* 如果详情地址未带id参数,重定向到公告列表 */}
            <Route path="/anno-detail"><Redirect to="/announcement" /></Route>
            {/* 特别说明 */}
            <Route path="/specialnote"><SpecialNote/></Route>
            {/* 玩法规则 */}
            <Route path="/rules"><RuleContent/></Route>
            {/* 404 */}
            <Route path="*"><Error404 /></Route>
          </Switch>
        </Suspense>
      </section>
      {
        // 没登陆不给红包提示
        member.isLoged ? <RedEnvelopeAlert/> : null
      }
    </PageStructure>
  );
};

export default AppLayout;
