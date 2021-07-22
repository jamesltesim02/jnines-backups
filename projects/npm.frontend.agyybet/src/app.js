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
import MemberInitialer from './components/common/member-initialer'
import Toaster, { ToastProvider } from './components/common/toaster'
import MatchInitialer from './components/matchs/match-initialer'

import AppHeader from './components/common/app-header'

import TabPage from './pages/tab-page'
import AnnouPage from './pages/annou'
import AnnouDetailPage from './pages/annou/detail'
import CategoryPage from './pages/category'
import PlayingSoonPage from './pages/playing-soon'
import FavoritePage from './pages/favorite'
import MatchDetailPage from './pages/match-detail'
import RulesPage from './pages/rules'
import SettingsPage from './pages/settings'

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
              <Container maxWidth="md">
                <Router>
                  {/* 页面路由容器 */}
                  <AppHeader />
                  {/* 路由监听器 */}
                  <RouteWatcher>
                    {/* 路由配置 */}
                    <Switch>
                      <Route path="/tab/"><TabPage /></Route>
                      <Route path="/annou/:aid"><AnnouDetailPage /></Route>
                      <Route path="/annou"><AnnouPage /></Route>
                      <Route path="/match/99/:mid"><MatchDetailPage state={99} /></Route>
                      <Route path="/category/:type/:sport/:title"><CategoryPage /></Route>
                      <Route path="/playing-soon"><PlayingSoonPage /></Route>
                      <Route path="/favorite"><FavoritePage /></Route>
                      <Route path="/match/:mid"><MatchDetailPage /></Route>
                      <Route path="/rules"><RulesPage /></Route>
                      <Route path="/settings"><SettingsPage /></Route>
                      <Route path="/signin"><SigninPage /></Route>
                      <Route exact path="/"><Redirect to="/tab/home" /></Route>
                    </Switch>
                  </RouteWatcher>
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
