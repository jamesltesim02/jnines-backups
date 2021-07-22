import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import React from 'react'
import ReactDOM from 'react-dom'

import ConfigOps from '../config/config.ops'
import WebApp from './web.app'

// import { isProd } from '../utils/env-utils'
// import * as serviceWorker from './serviceWorker'

// 绑定配置到全局
window.__AGYY_SPORTS_CONFIG__ = ConfigOps

ReactDOM.render(
  <WebApp search={window.location.search} />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// if (isProd()) {
  // serviceWorker.register()
// }
// serviceWorker.unregister()

// 热更新判断
if (module.hot) {
  module.hot.accept(err => {
    console.log('hot accept error:', err)
  })
}