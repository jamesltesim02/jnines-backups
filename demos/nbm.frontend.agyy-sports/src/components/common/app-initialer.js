import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory, useLocation } from 'react-router'
import throttle from 'lodash/throttle'

import withApi from '../../api'

import { MODE_SIZE } from '../../utils/get-flexible-mode'

const AppInitialer = ({
  store: { app },
  api: { pull }
}) => {
  const history = useHistory()
  const location = useLocation()

  React.useEffect(
    () => {
      // 判断是否为windows
      if ( /windows|win32/i.test(window.navigator.userAgent)) {
        document.documentElement.classList.add('windows')
      }

      // 页面尺寸变化事件(throttle截流)
      const handleResize = throttle(
        () => app.setDocWidth(document.documentElement.clientWidth),
        16
      )

      // (右键或长按)弹出菜单事件
      const handleContext = e => {
        // 判断是否是PC
        if (app.docWidth >= MODE_SIZE.medium.min) {
          return true
        }
        e.preventDefault()
        e.stopPropagation()
        e.cancelBubble = true
        return false
      }

      // 窗口尺寸变化
      window.addEventListener('resize', handleResize)
      // 阻止右键菜单
      window.addEventListener('contextmenu', handleContext)

      // 维护及地域限制判断
      pull.getSystemState().then(
        ({
          forbbiden,
          maintenance
        }) => {
          if (
            /^\/error\/(403|503)$/gi.test(location.pathname)
            &&
            !forbbiden
            &&
            !maintenance
          ) {
            history.replace('/')
            return
          }

          if (forbbiden) {
            history.replace(`/error/403?purePage=${app.purePage}`)
            return
          }

          if (maintenance) {
            history.replace(`/error/503?purePage=${app.purePage}`)
          }
        }
      )

      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('contextmenu', handleContext)
      }
    },
    []
  )

  // 不返回任何视图内容
  return null
}

export default withApi('pull')(
  inject('store')(
    observer(AppInitialer)
  )
)
