import App from 'next/app'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'mobx-react'
import { getSnapshot } from 'mobx-state-tree'

import Container from '@material-ui/core/Container'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

import { defaultLocale } from '../config/config.dev'

import theme from '../public/theme'
import { initializeStore } from '../store'

import Toaster, { ToastProvider } from '../components/common/toaster'
import RouteWatcher from '../components/common/route-watcher'
import {
  RouterContextProvider,
  PageTransition
} from '../components/common/page-transition'
import TabBar from '../components/common/tab-bar'
import ErrorCatcher from '../components/common/error-catcher'

import BetInitialer from '../components/match/bet-initialer'

import '../public/styles/common.css'
import 'swiper/css/swiper.css'

export default class extends App {
  constructor (props) {
    super(props)
    this.store = initializeStore(null, props.initialState)
  }

  /**
   * 根据环境创建对应的store对象
   *
   * @param {object} param0 
   */
  static async getInitialProps ({ Component, ctx }) {
    // 初始化mobx的store对象
    const store = initializeStore(ctx)

    // 获取初始化参数并保存到store中
    const {
      locale,
      messages = {},
      token,
      memberInfo
    } = ctx.req || window.__NEXT_DATA__.props

    store.app.setLocale(locale || defaultLocale)
    store.member.setToken(token || null)
    store.member.setMemberInfo(memberInfo || null)

    // 调用页面的getInitialProps函数,实现初始化
    let pageProps = {}
    if (Component.getInitialProps) {
      try {
        pageProps = await Component.getInitialProps(ctx)
      } catch (e) {
        console.warn('initial props error:', e)
      }
    }

    return {
      initialState: getSnapshot(store),
      pageProps,
      locale,
      messages,
      token,
      memberInfo
    }
  }

  componentDidMount () {
    // 服务端渲染首页样式处理
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render () {
    const {
      // 当前页面路由对象
      Component,
      // 当前页面参数
      pageProps,
      // 路由对象
      router,
      // 当前语言key
      locale,
      // 当前语言包对象
      messages
    } = this.props

    return (
      // 错误处理层, 统一错误抓取并处理
      <ErrorCatcher>
        {/* 路由provider */}
        <RouterContextProvider>
          {/* 皮肤信息统一处理层 */}
          <ThemeProvider theme={theme}>
            {/* material 样式统一嵌入 */}
            <CssBaseline />
            {/* mobx store provider */}
            <Provider store={this.store}>
              {/* 初始化投注相关内容(查询nbuserid) */}
              <BetInitialer />
              {/* i18n国际化层 */}
              <IntlProvider locale={locale} messages={messages}>
                {/* toast provider */}
                <ToastProvider>
                  {/* toast 显示控制 */}
                  <Toaster />
                  {/* 路由变化监听器, 登录判断, tab显示处理 */}
                  <RouteWatcher>
                    {/* 页面居中并限制最大宽度 */}
                    <Container>
                      {/* 路由页面切换动画处理 */}
                      <PageTransition>{
                        ({
                          Component: TransitionComponent,
                          pageProps: transitionProps
                        }) => {
                          return (
                            TransitionComponent ? (
                              <TransitionComponent
                                className="page-component"
                                router={router}
                                {...transitionProps}
                              />
                            ) : (
                              <Component
                                className="page-component"
                                {...pageProps}
                                router={router}
                              />
                            )
                          )
                        }
                      }</PageTransition>
                    </Container>
                  </RouteWatcher>
                  {/* tab bar */}
                  <TabBar />
                </ToastProvider>
              </IntlProvider>
            </Provider>
          </ThemeProvider>
        </RouterContextProvider>
      </ErrorCatcher>
    )
  }
}

