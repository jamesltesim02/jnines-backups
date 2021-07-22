import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import React from 'react'
import ReactDOM from 'react-dom'

// import { isProd } from './utils/env-utils'

import App from './app'
// import * as serviceWorker from './serviceWorker'

/** 阻止右键菜单 */
window.addEventListener('contextmenu', e => {
  e.preventDefault()
  e.stopPropagation()
  e.cancelBubble = true
  return false
})

ReactDOM.render(
  // <React.StrictMode>
  //  <App />
  // </React.StrictMode>,
  <App />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// if (isProd()) {
  // serviceWorker.register()
// }
// serviceWorker.unregister()
