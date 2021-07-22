import React from 'react'
import { inject, observer} from 'mobx-react'

import withApi from '../../api'

import { CLIENT_TYPE } from '../../config/config.ops'

import Pusher from '../../utils/pusher'

const MatchPusher = ({
  store: {
    match: {
      pushData,
      onDataChange,
      favorite
    },
    member: {
      isLoged,
      memberInfo
    }
  },
  api
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

  /**
   * 推送消息回调处理
   *
   * @param {object} msg 接收到的推送消息
   */
  const pushCallback = msg => {
    if(msg) {
      onDataChange(msg)
    }
  }

  // 推送数据变化时更新时重新注册
  React.useEffect(() => {
    if (!pusher) {
      return
    }
    pusher.registConcern(
      {
        token: (
          isLoged
          ? memberInfo.token 
          : `Temp${Date.now()}${Math.random()}_${CLIENT_TYPE}`
        ),
        ...pushData
      },
      pushCallback
    )
  }, [pushData])

  React.useEffect(
    () => {
      if (isLoged) {
        api.favorite.getIds().then((ids) => {
          if (!ids) {
            return
          }
          favorite.setFavids(ids.map(({ matchId }) => matchId))
        })
      }
    },
    [isLoged]
  )

  return null
}

export default withApi('favorite')(
  inject('store')(
    observer(MatchPusher)
  )
)
