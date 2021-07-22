import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import AmountImage from './amount.png'
import UsersImage from './users.png'

const useStyles = makeStyles(
  {
    amount: {
      backgroundImage: `url(${AmountImage})`
    },
    users: {
      backgroundImage: `url(${UsersImage})`
    }
  },
  { name: 'IconBetvalue' }
)

export default function IconBetvalue ({
  size = 10,
  type = 'users'
}) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={classes[type]}
    />
  )
}
