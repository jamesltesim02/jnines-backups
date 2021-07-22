import { mainSiteUrls } from '../config/config.dev'

import { initializeStore } from '../store'

export default function toSignin () {
  const store = initializeStore()

  const params = new URLSearchParams(store.app.initSearch)
  window.top.location = new URL(
    mainSiteUrls.signin,
    (
      params.get('origin')
      ||
      store.app.origin
      ||
      window.__AGYY_SPORTS_CONFIG__.DEFAULT_ORIGIN
    )
  )
}
