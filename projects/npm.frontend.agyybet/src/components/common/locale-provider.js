import React from 'react'
import { inject, observer } from 'mobx-react'
import { IntlProvider } from 'react-intl'

import localeMessages from '../../assets/locales'

const LocaleProvider = ({
  children,
  store: {
    app: { locale }
  }
}) => {
  return (
    <IntlProvider
      locale={locale}
      messages={localeMessages[locale]}
    >
      {children}
    </IntlProvider>
  )
}

export default inject('store')(
  observer(LocaleProvider)
)