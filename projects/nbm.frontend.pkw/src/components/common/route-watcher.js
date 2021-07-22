import React from 'react'
import { inject, observer } from 'mobx-react'
import { useLocation } from 'react-router'

const RouteWatcher = ({
  store: { app },
  children
}) => {
  const location = useLocation()
  React.useEffect(
    () => {
      window.scrollTo(0, 0)
      app.setCurrpath(`${location.pathname}${location.search}`)
    },
    [location]
  )
  return children
}

export default inject('store')(
  observer(RouteWatcher)
)
