import React, {lazy, Suspense} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppConfig from './configs';

// import 'antd/lib/style/themes/default.less'
import 'antd/dist/antd.less';
import './assets/styles/common.less';

import appStore from './stores/app';
import LocaleProvider from './components/common/LocaleProvider';

import AppLayout from './pages/AppLayout';
import AppInitial from './components/common/AppInitial';
import PushInitial from './components/push/PushInitial';
import SoundPlayer from './components/matchs/SoundPlayer';
import LoadingBar from "./components/common/LoadingBar";
import AccountModal from "./components/account/AccountModal";
import { DEFAULT_LOCALE, Locales } from './consts/app';

const Signin = lazy(() => import('./pages/Signin'));
const Subportal = lazy(() => import('./pages/Subportal'));
const PromotionDetails = lazy(() => import('./pages/Promotion/Details'));
const PayForm = lazy(() => import('./pages/Member/Recharge/PayForm'));
const OtherGames = lazy(() => import('./pages/OtherGames'));
const Activity = lazy(() => import('./pages/Activity'))

function App () {
  React.useEffect(() => {
    const { classList } = document.body;
    classList.add('pc');
    if (AppConfig.THIRD_MODE) {
      classList.add('j9s-third');
    }

  },[]);

  return (
    <>
      {/* 开发调试工具 */}
      {
        process.env.NODE_ENV !== 'production'
        ? React.createElement(
          require('./components/common/DevTools').default
        ) : null
      }
      <LocaleProvider>
        <Router>
          <AppInitial>
            {/* 推送初始化 */}
            <PushInitial />
            <Suspense fallback={<LoadingBar/>}>
              <Switch>
                {/* 二级页面 */}
                <Route path="/quickbet"><Subportal /></Route>
                {/* 登录,测试用 */}
                <Route path="/signin"><Signin /></Route>
                {/* 优惠详情 */}
                <Route path="/promo-detail"><PromotionDetails /></Route>
                {/*活动页*/}
                <Route path="/activity"><Activity /></Route>
                {/* 存款表单提交页面 */}
                <Route path="/pay-form"><PayForm /></Route>
                {/* 其他游戏 */}
                <Route path="/other/:game"><OtherGames /></Route>
                {/* 其他主要路由 */}
                <Route path="/"><AppLayout /></Route>
              </Switch>
            </Suspense>
            {/*进球提示*/}
            <SoundPlayer />
            {/*登录注册弹窗*/}
            <AccountModal />
          </AppInitial>
        </Router>
      </LocaleProvider>
    </>
  )
}

export default App
