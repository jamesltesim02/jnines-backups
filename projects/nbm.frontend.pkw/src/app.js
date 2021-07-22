import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

import Container from '@material-ui/core/Container'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

import { Provider } from 'mobx-react'

import { initializeStore } from './store'
import theme from './assets/theme'

import LocaleProvider from './components/common/locale-provider'
import RouteWatcher from './components/common/route-watcher'
import MatchInitialer from './components/match/match-initialer'
import MemberInitialer from './components/common/member-initialer'
import Toaster, { ToastProvider } from './components/common/toaster'
import Cart from './components/cart'

import MatchsPage from './pages/matchs'
import DetailPage from './pages/detail'
import CategoryPage from './pages/category'
import OrdersPage from './pages/orders'
import FavoritePage from './pages/favorite'
import ResultsPage from './pages/results'
import SettingsPage from './pages/settings'
import RulesPage from './pages/rules'
import ErrorPage from './pages/error'

import SigninPage from './pages/signin'

import './assets/common.css'

function App() {
  const store = initializeStore()

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
            <MemberInitialer>
              {/* 推送信息处理控件r */}
              <MatchInitialer />
              {/* 页面居中并限制最大宽度 */}
              <Container>
                {/* 页面路由容器 */}
                <Router>
                  {/* 路由监听器 */}
                  <RouteWatcher>
                    {/* 路由配置 */}
                    <Switch>
                      <Route exact path="/"><Redirect to="/matchs/all" /></Route>
                      <Route path="/matchs/"><MatchsPage /></Route>
                      <Route path="/detail/:id"><DetailPage /></Route>
                      <Route path="/category/:sid/:type/:title"><CategoryPage /></Route>
                      <Route path="/orders"><OrdersPage /></Route>
                      <Route path="/favorite"><FavoritePage /></Route>
                      <Route path="/results"><ResultsPage /></Route>
                      <Route path="/settings"><SettingsPage /></Route>
                      <Route path="/rules"><RulesPage /></Route>
                      <Route path="/signin"><SigninPage /></Route>
                      <Route path="/error/:ecode"><ErrorPage /></Route>
                      <Route path="*"><Redirect to="/error/404" /></Route>
                    </Switch>
                  </RouteWatcher>
                  {/* 购物车 */}
                  <Cart />
                </Router>
              </Container>
            </MemberInitialer>
          </ToastProvider>
        </LocaleProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App
