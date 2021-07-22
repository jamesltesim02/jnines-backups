import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { AppLocaleProvider } from './components/common/AppLocale';
import AppInitial from './components/common/AppInitial';
import PushInitial from './components/push/PushInitial';
import LoadingBar from "./components/common/LoadingBar";
import Cart from "./components/cart/Cart";
import Search from "./components/Search";
import RedEnvelopeAlert from "./components/promotions/redenvelope/redenvelopeAlert/";
import SoundPlayer from './components/match/SoundPlayer';

import './assets/styles/common.less';

// tab页
import TabsPage from './pages/Tabs';
// 具体体育项页面
import SportPage from './pages/Sport';
// 串关页面
import ParlayPage from './pages/Parlay';

const PayForm = React.lazy(() => import('./pages/Tabs/Member/Recharge/PayForm'));

// 比赛详情
const MatchDetail = React.lazy(() => import('./pages/MatchDetail'));
// 我的赛程页面
const Favorites = React.lazy(() => import('./pages/Favorites'));
// 联赛页面
const TourMatchs = React.lazy(() => import('./pages/TourMatchs'));
// 注单页面
const TicketPage = React.lazy(() => import('./pages/Ticket'));
// 公告列表
const AnnouncePage = React.lazy(() => import('./pages/Announce'));
// 公告详情
const AnnounceDetailPage = React.lazy(() => import('./pages/Announce/Detail'));
// 红包记录
const RedEnvelopeRecords = React.lazy(() => import('./pages/RedEnvelopeRecords'));
// 优惠详情
const PromoDetail = React.lazy(() => import('./pages/PromoDetail'));
// 交易记录
const TransactionPage = React.lazy(() => import('./pages/Transaction'));

// 404错误页面
const Error404 = React.lazy(() => import('./pages/Error/Error404'));
// 特别说明
const SpecialNotePage = React.lazy(() => import('./pages/SpecialNote'));
// 玩法规则
const RulesPage = React.lazy(() => import('./pages/Rules'));
// 偏好设置
const PreferencePage = React.lazy(() => import('./pages/Preference'));

// 登录
const Login = React.lazy(() => import('./pages/Account/Login'));
// 注册
const Register = React.lazy(() => import('./pages/Account/Register'));
// 忘记密码
const Forget = React.lazy(() => import('./pages/Account/Forget'));
// 会员中心子页面路由
const MemberRoutes = React.lazy(() => import('./pages/Tabs/Member/MemberRoutes'));
// 其他游戏路由
const OtherGames = React.lazy(() => import('./pages/OtherGames'));
// 主题活动
const Activity = React.lazy(() => import('./pages/Activity'));

function App() {

  return (
    <>
      {/* 开发调试工具 */}
      {
        process.env.NODE_ENV !== 'production'
        ? React.createElement(
          require('./components/common/DevTools').default
        ) : null
      }
      <AppLocaleProvider>
        <Router>
          <AppInitial>
            {/* 推送初始化 */}
            <PushInitial />
            <Suspense fallback={<LoadingBar style={{ height: '100vh' }} />}>
              <Switch>
                {/* 根目录直接重定向到home */}
                <Route exact path="/"><Redirect to="/tab/home" /></Route>
                {/* 存款表单提交页面 */}
                <Route path="/pay-form"><PayForm /></Route>
                {/* 比赛详情 */}
                <Route path={['/detail/:mid', '/parlay/detail/:mid']}><MatchDetail /></Route>
                {/* 滚球列表 */}
                <Route path="/parlay"><ParlayPage /></Route>
                {/* 我的赛程 */}
                <Route path="/favorites"><Favorites /></Route>
                {/* 联赛页 */}
                <Route path="/tours/:sid/:tours"><TourMatchs /></Route>
                {/* 体育项比赛列表页 */}
                <Route path="/sport/:sid"><SportPage /></Route>
                {/* 其他主要路由 */}
                <Route path="/tab"><TabsPage /></Route>
                {/*我的注单*/}
                <Route path="/ticket"><TicketPage /></Route>
                {/*交易记录*/}
                <Route path="/member/records"><TransactionPage /></Route>
                {/*公告列表*/}
                <Route path="/announce"><AnnouncePage /></Route>
                {/*公告详情*/}
                <Route path="/announce-detail/:id"><AnnounceDetailPage /></Route>
                {/*红包记录*/}
                <Route path="/re-records"><RedEnvelopeRecords /></Route>
                {/* 优惠详情 */}
                <Route path="/promo-detail"><PromoDetail /></Route>
                {/*特别说明*/}
                <Route path="/special-note"><SpecialNotePage /></Route>
                {/*玩法规则*/}
                <Route path="/rules"><RulesPage /></Route>
                {/*偏好设置*/}
                <Route path="/preference"><PreferencePage /></Route>
                {/*登录*/}
                <Route path="/login"><Login /></Route>
                {/*注册*/}
                <Route path="/register"><Register /></Route>
                {/*忘记密码*/}
                <Route path="/forget"><Forget /></Route>
                {/* 会员中心子页面 */}
                <Route path="/member"><MemberRoutes /></Route>
                {/* 其他游戏 */}
                <Route path="/other/:game"><OtherGames /></Route>
                {/*主题活动*/}
                <Route path="/activity"><Activity /></Route>
                {/* 404 */}
                <Route path="*"><Error404 /></Route>
                {/* 优惠详情 */}
                {/* <Route path="/promo-detail"><PromotionDetails /></Route> */}
              </Switch>
            </Suspense>
            <SoundPlayer />
            {/*投注栏*/}
            <Cart />
            {/*搜索栏*/}
            <Search />
            {/*红包提示*/}
            <RedEnvelopeAlert />
          </AppInitial>
        </Router>
      </AppLocaleProvider>
    </>
  );
}

export default App;
