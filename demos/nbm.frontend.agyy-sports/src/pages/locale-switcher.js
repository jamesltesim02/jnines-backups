import React from 'react'
import { inject, observer } from 'mobx-react'
import { IntlProvider } from 'react-intl'
import { useParams, useLocation } from 'react-router'

import Analytics from 'react-router-ga'

const LocaleSwitcher = ({
  children,
  store: {
    app,
    toast
  }
}) => {
  const { locale } = useParams()
  const location = useLocation()

  const [messages, setMessages] = React.useState(null)

  React.useEffect(
    () => {
      app.setLocale(locale)
      if (messages && messages[locale]) {
        return
      }
      toast.loading()
      const msgImporter = (
        process.env.NODE_ENV === 'production'
        ? import(/* webpackChunkName: "../locale/locale-web-chunk" */ '../assets/locales/index.js')
        : import('../assets/locales/index.js')
      )
      msgImporter.then(
        ({ default: messages }) => setMessages(messages)
      ).finally(
        () => toast.loading(false)
      )
    },
    [locale]
  )

  React.useEffect(
    () => {
      window.scrollTo(0, 0)
      app.setCurrpath(`${location.pathname}${location.search}`)
    },
    [location]
  )

  const { GA_ID } = window.__AGYY_SPORTS_CONFIG__
  // 如果有 谷歌统计id并且不是这iframe中的才做路由统计功能
  const analyticsable = (
    GA_ID
    &&
    window === window.top
  )

  return (
    messages === null
    ? null
    : (
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
      >
        {
          analyticsable ? (
            <Analytics id={GA_ID}>
              {children}
            </Analytics>
          ) : children
        }
      </IntlProvider>
    )
  )
}

export default inject('store')(
  observer(LocaleSwitcher)
)
