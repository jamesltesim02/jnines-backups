import React from 'react'
import { inject, observer } from 'mobx-react'
import { useLocation } from 'react-router'
import Analytics from 'react-router-ga'

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

  const { GA_ID } = window.__AGYY_SPORTS_CONFIG__
  // 如果有 谷歌统计id并且不是这iframe中的才做路由统计功能
  const analyticsable = (
    GA_ID
    &&
    window === window.top
  )

  return (
    analyticsable ? (
      <Analytics id={GA_ID}>
        {children}
      </Analytics>
    ) : children
  )
}

export default inject('store')(
  observer(RouteWatcher)
)
