import React from 'react'
import { inject, observer} from 'mobx-react'

import Pusher from '../../utils/pusher'

const MatchPusher = ({
  store: {
    app,
    member: {
      isLoged,
      memberInfo
    },
    matchs,
    cart
  }
}) => {
  const [pusher] = React.useState(new Pusher())

  // 组件挂载和卸载事件
  React.useEffect(() => {
    // 创建推送链接
    const userId = (
      isLoged
      ? `${memberInfo.userId}_${app.clientType}_${memberInfo.currency}_${app.originType}`
      : `Temp${Date.now()}${Math.random()}`
    )
    pusher.setUserId(userId)

    if (pusher.connected) {
      pusher.reconnect()
    } else {
      pusher.connect()
    }

    // 注册页面焦点获取事件, 重新创建链接以及注册推送数据
    // window.addEventListener('focus', pusher.reconnect.bind(pusher))

    // 组件卸载时断开连接
    return () => {
      pusher.disconnect()
      // window.removeEventListener('focus', pusher.reconnect.bind(pusher))
    }
  }, [isLoged])

  // 推送数据变化时更新时重新注册
  React.useEffect(
    () => {
      if (!pusher) {
        return
      }

      pusher.registConcern(
        {
          token: (
            isLoged
            ? memberInfo.token
            : `Token${Date.now()}${Math.random()}_${app.clientType}`
          ),
          matchs: matchs.pushData.matchs,
          options: cart.pushData,
          mainMatchId: matchs.pushData.mainMatchId
        },
        event => {
          if (!event) {
            return
          }

          if (event.nt !== 100) {
            matchs.onDataChange(event)
          }
          cart.onDataChange(event)
          // 收到推送事件触发全局事件
          window.dispatchEvent(new CustomEvent(
            `push-nt-${event.nt}`,
            { detail: event.data }
          ));
        }
      )
    },
    [matchs.pushData, cart.pushData]
  )

  return null
}

export default inject('store')(
  observer(MatchPusher)
)
