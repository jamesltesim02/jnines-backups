import React from 'react'
import { inject, observer } from 'mobx-react'

import { reloadTime } from '../../config/config.dev'

import withApi from '../../api'

const MemberInitialer = ({
  store: { member },
  api: { bet },
  children
}) => {
  const [queryVersion, setQueryVersion] = React.useState(1)
  const [reloadTimer, setReloadTimer] = React.useState(null)
  const [checking, setChecking] = React.useState(true)
  React.useEffect(
    () => {
      if (!member.tempToken) {
        setChecking(false)
        return
      }
      bet.getBalance(member.tempToken).then(result => {
        if (!result || !result.customerId) {
          member.setToken(null)
          member.setMemberInfo(null)
          clearTimeout(reloadTimer)
          return
        }
        console.log(`账号: ${result.customerId}, 余额: ${result.balance}`)
        member.setMemberInfo({
          userId: result.nbUserId,
          token: member.tempToken,
          balance: result.balance,
          currency: result.currency
        })

        setReloadTimer(
          setTimeout(
            () => setQueryVersion(queryVersion + 1),
            reloadTime
          )
        )
      }).finally(() => {
        setChecking(false)
      })
      return () => clearTimeout(reloadTimer)
    },
    [queryVersion]
  )

  return checking ? null : children
}

export default inject('store')(
  observer(
    withApi('bet')(MemberInitialer)
  )
)
