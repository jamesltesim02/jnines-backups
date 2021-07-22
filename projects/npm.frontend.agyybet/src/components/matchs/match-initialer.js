import React from 'react'
import { inject, observer} from 'mobx-react'

import withApi from '../../api'

import { CLIENT_TYPE } from '../../config/config.ops'

import Pusher from '../../utils/pusher'

const MatchPusher = ({
  store: {
    member: {
      isLoged,
      memberInfo
    },
    matchs,
    cart,
    favorite
  },
  api: { pull }
}) => {
  const [pusher] = React.useState(new Pusher())

  // 组件挂载和卸载事件
  React.useEffect(() => {
    // 创建推送链接
    const userId = isLoged ? memberInfo.userId : `Temp${Date.now()}${Math.random()}`
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
            : `Token${Date.now()}${Math.random()}_${CLIENT_TYPE}`
          ),
          matchs: matchs.pushData,
          options: cart.pushData
        },
        event => {
          if (!event) {
            return
          }
          if (event.nt !== 100) {
            matchs.onDataChange(event)
          }
          cart.onDataChange(event)
        }
      )
    },
    [matchs.pushData, cart.pushData]
  )

  // 查询用户收藏的比赛和联赛
  React.useEffect(
    () => {
      favorite.clear()
      if (isLoged) {
        pull.getFavIds().then(ids => favorite.setFavs(ids))
      }
    },
    [isLoged]
  )

  return null
}

export default withApi('pull')(
  inject('store')(
    observer(MatchPusher)
  )
)
