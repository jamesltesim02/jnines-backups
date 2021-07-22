import App from 'next/app'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'mobx-react'
import { getSnapshot } from 'mobx-state-tree'
import Toast from 'react-toast-mobile'

import devConfig from '../configs/config.dev'

import { initializeStore } from '../stores'
import { isServer } from '../utils/env-utils'

import zhCN from '../public/locales/zh-CN'
import zhTW from '../public/locales/zh-TW'
import enUS from '../public/locales/en-US'

import '../public/styles/common.css'
import 'react-toast-mobile/lib/react-toast-mobile.css'

const appLocales = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS
}


export default class extends App {

  constructor (props) {
    super(props)
    this.store = initializeStore(props.isServer, props.initialState)
  }

  static async getInitialProps ({ Component, ctx }) {
    //
    // Use getInitialProps as a step in the lifecycle when
    // we can initialize our store
    //
    const store = initializeStore(isServer())
    //
    // Check whether the page being rendered by the App has a
    // static getInitialProps method and if so call it
    //
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      initialState: getSnapshot(store),
      isServer,
      pageProps
    }
  }

  render () {
    const { Component, pageProps, router } = this.props

    console.log(router.query.locale)

    let locale = router.query.locale
    let appLocale = appLocales[locale]

    if (!appLocale) {
      locale = devConfig.defaultLocale
      appLocale = appLocales[locale]
    }

    console.log('_app.js locale in app:', locale)
    console.log('_app.js locale in app:', appLocale)

    console.log('....自定义 app, 可以添加插件等全局初始化操作, 每个page初始化时都会执行')

    return (
      <IntlProvider
        locale={locale}
        messages={appLocale}
      >
        <Provider store={this.store}>
          <div className="app-container">
            <Toast />
            <Component
              className="page-component"
              {...pageProps}
              router={router}
            />
          </div>
          <style global jsx>{`
            .app-container {
              width: 100%;
              height: 100%;
            }
            .app-container > div.page-component {
              min-height: 100%;
            }
          `}</style>
        </Provider>
      </IntlProvider>
    )
  }
}

