import React from 'react'
import { inject, observer } from 'mobx-react'
import { IntlProvider } from 'react-intl'

const LocaleProvider = ({
  children,
  store: {
    app: { locale },
    toast
  }
}) => {
  const [messages, setMessages] = React.useState(null)

  React.useEffect(
    () => {
      if (messages && messages[locale]) {
        return
      }
      toast.loading()
      const msgImporter = (
        process.env.NODE_ENV === 'production'
        ? import(/* webpackChunkName: "../locale/locale-web-chunk" */ '../../assets/locales/index.js')
        : import('../../assets/locales/index.js')
      )
      msgImporter.then(
        ({ default: messages }) => setMessages(messages)
      ).finally(
        () => toast.loading(false)
      )
    },
    [locale]
  )

  return (
    messages === null
    ? null
    : (
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
      >
        {children}
      </IntlProvider>
    )
  )
}

export default inject('store')(
  observer(LocaleProvider)
)

