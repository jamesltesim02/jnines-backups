import React, {lazy, Suspense} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import 'antd/lib/style/themes/default.less'
import 'antd/dist/antd.less';
import './assets/styles/common.less';

import LocaleProvider from './components/common/LocaleProvider';

import AppLayout from './pages/AppLayout';
import AppInitial from './components/common/AppInitial';
import PushInitial from './components/push/PushInitial';
import SoundPlayer from './components/matchs/SoundPlayer';
import LoadingBar from "./components/common/LoadingBar";


const Signin = lazy(() => import('./pages/Signin'));
const Subportal = lazy(() => import('./pages/Subportal'));
const PromotionDetails = lazy(() => import('./pages/Promotion/Details'))

function App () {
  React.useEffect(() => {
    document.body.classList.add('pc');
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
                {/* 其他主要路由 */}
                <Route path="/"><AppLayout /></Route>
              </Switch>
            </Suspense>
            <SoundPlayer />
          </AppInitial>
        </Router>
      </LocaleProvider>
    </>
  )
}

export default App
