import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import { reloadTime } from '../../config/config.dev'

import withApi from '../../api'

const useStyles = makeStyles(
  {
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
    },
  },
  { name: 'MemberInitialer' }
)

const MemberInitialer = ({
  store: {
    member,
    favorite
  },
  api: {
    pull,
    bet
  },
  children
}) => {
  const classes = useStyles()

  const [queryVersion, setQueryVersion] = React.useState(1)
  const [checking, setChecking] = React.useState(true)

  React.useEffect(
    () => {
      if (!member.tempToken) {
        setChecking(false)
        return
      }
      let reloadTimer = null
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
          customerId: result.customerId,
          balance: result.balance,
          currency: result.currency
        })

        reloadTimer = setTimeout(
            () => setQueryVersion(queryVersion + 1),
            reloadTime
          )
      }).catch(
        () => member.setMemberInfo(null)
      ).finally(
        () => setChecking(false)
      )
      return () => clearTimeout(reloadTimer)
    },
    [queryVersion]
  )

  // 查询用户收藏的比赛和联赛
  React.useEffect(
    () => {
      favorite.clear()
      if (member.isLoged) {
        pull.getFavIds().then(ids => favorite.setFavs(ids))
      }
    },
    [member.isLoged]
  )

  return checking ? (
    <div className={classes.loading}>
      <CircularProgress size={36} />
    </div>
  ) : children
}

export default withApi('pull', 'bet')(
  inject('store')(
    observer(MemberInitialer)
  )
)
