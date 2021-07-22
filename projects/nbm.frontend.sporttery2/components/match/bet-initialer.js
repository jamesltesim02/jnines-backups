import React from 'react'
import { inject, observer }  from 'mobx-react'

import withApi from '../../api'

import { CLIENT_TYPE } from '../../config/config.ops'

import Pusher from '../../utils/pusher'

const BetInitialer = ({
  store: {
    member,
    cart,
    matchs
  },
  api: { bet }
}) => {
  const [pusher] = React.useState(new Pusher())

  React.useEffect(
    () => {
      const initialPusher = async () => {
        let betId = `User${Date.now()}${Math.random()}`
        if (member.isLoged) {
          const result = await bet.getBalance(member.token)
          if (result && result.nbUserId) {
            betId = result.nbUserId
            member.setBetId(betId)
          }
        }

        pusher.setUserId(betId)
        if (pusher.connected) {
          pusher.reconnect()
        } else {
          pusher.connect()
        }

        // 注册页面焦点获取事件, 重新创建链接以及注册推送数据
        // window.addEventListener('focus', pusher.reconnect.bind(pusher))
      }

      initialPusher()
  
      // 组件卸载时断开连接
      return () => {
        pusher.disconnect()
        // window.removeEventListener('focus', pusher.reconnect.bind(pusher))
      }
    },
    [member.isLoged]
  )

  // 推送数据变化时更新时重新注册
  React.useEffect(
    () => {
      if (!pusher) {
        return
      }

      pusher.registConcern(
        {
          token: (
            member.isLoged
            ? member.token 
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

  return null
}

export default withApi('bet')(
  inject('store')(
    observer(BetInitialer)
  )
)
