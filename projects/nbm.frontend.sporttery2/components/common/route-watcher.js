import React from 'react'
import { observer } from 'mobx-react'

import devConfig from '../../config/config.dev'

import { toSignin } from './ag8-link'
import { withLocaledRouter } from './localed-router'

function RouteWatcher ({
  localedRouter,
  store: {
    app,
    member,
    toast
  },
  children
}) {
  const [needAuth, setNeedAuth] = React.useState(false)
  const {
    needAuth: auths
  } = devConfig
  /**
   * 路由变化事件
   * @param {string} url 将要转到的路由地址
   */
  const handleStart = (url) => {
    // 获取不包含locale的url
    const path = url.replace(`/${app.locale}`, '')
    // 判断是否需要登录
    if (
      !member.isLoged
      &&
      auths.findIndex(exp => exp.test(path)) > -1
    ) {
      setNeedAuth(true)
      toSignin()
      setTimeout(() => localedRouter.replace(localedRouter.pathname))
      return false
    }

    // 如果不需要跳转到登录,则显示loading
    toast.loading()
    setNeedAuth(false)
  }

  /**
   * 路由加载完成事件
   */
  const handleComplete = (url) => {
    const pathname = url.replace(`/${app.locale}`, '')
    app.setLastpath(pathname)
    toast.loading(false)
    window.scrollTo(0, 0)
  }

  /**
   * 路由加载出错事件
   *
   * @param {Error} error 错误对象
   */
  const handleError = (error) => {
    toast.loading(false)
    // 如果是主动取消的则不作提示
    if (error.canceled) {
      return
    }
    /*
    toast.optionsToast(
      `common.message.pageerror`,
      {
        variant: 'error',
        intl: true
      }
    )
    */
    // localedRouter.back()
  }

  // 路由变化事件注册
  React.useEffect(
    () => {
      const { events } = localedRouter
      events.on('routeChangeStart', handleStart)
      events.on('routeChangeError', handleError)
      events.on('routeChangeComplete', handleComplete)

      return () => {
        events.off('routeChangeStart', handleStart)
        events.off('routeChangeError', handleError)
        events.off('routeChangeComplete', handleComplete)
      }
    },
    []
  )

  return needAuth ? null : children
}

export default withLocaledRouter(
  observer(RouteWatcher)
)