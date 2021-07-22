import React from 'react'
import { inject, observer } from 'mobx-react'

import NormalPage from './error-503-normal'
import QuickPage from './error-503-quickbet'

const ErrorPage = ({
  store: { app }
}) => {

  const initParam = new URLSearchParams(app.initSearch)
  const isTemp = initParam.get('temp') === 'true'

  React.useEffect(
    () => {
      document.body.classList.add('error-unuseable')
      return () => document.body.classList.remove('error-unuseable')
    },
    []
  )

  return (
    app.originType === 2
    ? <QuickPage temp={isTemp} />
    : <NormalPage temp={isTemp} />
  )
}

export default inject('store')(
  observer(ErrorPage)
)
