import React, { Suspense } from 'react'
import { Provider } from 'mobx-react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

import ThemeProvider from '@material-ui/styles/ThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'
import CircularProgress from '@material-ui/core/CircularProgress'

import LocaleProvider from '../components/common/locale-provider'
import RouteWatcher from '../components/common/route-watcher'
import AppInitialer from '../components/common/app-initialer'
import MemberInitialer from '../components/common/member-initialer'
import MatchInitialer from '../components/matchs/match-initialer'
import Toaster, { ToastProvider } from '../components/common/toaster'

import { initializeStore } from '../store'
import theme from '../assets/styles/theme.web'
import '../assets/styles/common.css'

import AppHeader from '../components/common/app-header'
import AppFooter from '../components/common/app-footer'

import TabPage from '../pages/tab-page'
import AnnouPage from '../pages/annou'
import AnnouDetailPage from '../pages/annou/detail'
import CategoryPage from '../pages/category'
import PlayingSoonPage from '../pages/playing-soon'
import FavoritePage from '../pages/favorite'
import MatchDetailPage from '../pages/match-detail'
import TournamentPage from '../pages/tournament'
import SettingsPage from '../pages/settings'
import QuickbetPage from '../pages/quickbet'
import RedEnvelopeAlert from "../components/promotions/redenvelope/redenvelopeAlert";
import Redenvelope from "../components/promotions/redenvelope/redenvelope";

// 特别说明
const SpecialnotePage = React.lazy(() => import('../pages/specialnote'))
// 投注规则
const RulesPage = React.lazy(() => import('../pages/rules'))
// 优惠活动
const PromotionsPage = React.lazy(() => import('../pages/promotions'))
// 活动详情
const PromotionsDetail = React.lazy(() => import('../pages/promo-details'))
// 错误页面
const ErrorPage = React.lazy(() => import('../pages/error'))

// 登录
const SigninPage = React.lazy(() => import('../pages/signin'))


const MatchDetail = (props) => (
  <>
    {/* 红包活动 */}
    <Redenvelope/>
    <MatchDetailPage {...props} />
  </>
)


function WebApp({ search }) {
  const store = initializeStore()
  // 获取来源站点参数
  const params = new URLSearchParams(search)

  const token = params.get('token')
  const clientType = +params.get('clientType')
  const origin = params.get('origin')
  const locale = params.get('locale')
  const purePage = params.get('purePage')
  const originType = +params.get('originType')

  if (
    origin
    ||
    clientType
    ||
    locale
  ) {
    store.app.initAppStore({
      origin,
      clientType,
      locale
    })
  }

  if (token) {
    store.member.setTempToken(token)
  }

  store.app.setPurePage(purePage === 'true')
  store.app.setInitSearch(search)
  if (/\/quickbet/.test(window.location) || originType === 2) {
    store.app.setOriginType(2)
    store.app.setPurePage(true)
    document.body.classList.add('quickbet')
  }

  return (
    // {/* 皮肤信息统一处理层 */}
    <ThemeProvider theme={theme}>
      {/* 全局状态容器 */}
      <Provider store={store}>
        {/* material 样式统一嵌入 */}
        <CssBaseline />
        {/* 语言provider */}
        <LocaleProvider>
          {/* 全局消息容器 */}
          <ToastProvider>
            {/* toast 显示控制 */}
            <Toaster />
            {/* 用户信息初始化控件 */}
            <MemberInitialer>
              {/* 推送信息处理控件r */}
              <MatchInitialer />
              <Router>
                {/* 应用初始化,监听窗口大小变化及菜单事件 */}
                <AppInitialer />
                {/* 红包提示 */}
                <RedEnvelopeAlert/>
                {/* 页面头部块 */}
                <AppHeader />
                {/* 路由监听器 */}
                <RouteWatcher>
                  <Suspense
                    fallback={
                      <CircularProgress
                        size={35}
                        color="primary"
                        style={{margin: 'auto'}}
                      />
                    }
                  >
                    {/* 路由配置 */}
                    <Switch>
                      <Route path="/index.html"><Redirect to="/tab/home" /></Route>
                      <Route exact path="/"><Redirect to="/tab/home" /></Route>
                      <Route path="/tab/"><TabPage /></Route>
                      <Route path="/annou/:aid"><AnnouDetailPage /></Route>
                      <Route path="/annou"><AnnouPage /></Route>
                      <Route path="/match/99/:mid"><MatchDetail state={99} /></Route>
                      <Route path="/match/inPlay/:mid"><MatchDetail inplay /></Route>
                      <Route path="/match/:mid"><MatchDetail /></Route>
                      <Route path="/category/:type/:sport/:title"><CategoryPage /></Route>
                      <Route path="/playing-soon"><PlayingSoonPage /></Route>
                      <Route path="/favorite"><FavoritePage /></Route>
                      <Route path="/tour/:sport/99/:title"><TournamentPage /></Route>
                      <Route path="/tour/:sport/:title"><TournamentPage /></Route>
                      <Route path="/specialnote"><SpecialnotePage /></Route>
                      <Route path="/rules"><RulesPage /></Route>
                      <Route path="/settings"><SettingsPage /></Route>
                      <Route path="/quickbet"><QuickbetPage /></Route>
                      <Route path="/promotions/:name"><PromotionsPage /></Route>
                      <Route path="/promo-detail"><PromotionsDetail /></Route>
                      <Route path="/signin"><SigninPage /></Route>
                      <Route path="/error/:ecode"><ErrorPage /></Route>
                      <Route path="*"><Redirect to="/error/404" /></Route>
                    </Switch>
                  </Suspense>
                </RouteWatcher>
              </Router>
              <AppFooter />
            </MemberInitialer>
          </ToastProvider>
        </LocaleProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default WebApp
