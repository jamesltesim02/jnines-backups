import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import HomeImage from './home.png'
import HomeActiveImage from './home-active.png'
import ScoreImage from './score.png'
import ScoreActiveImage from './score-active.png'
import LiveImage from './live.png'
import LiveActiveImage from './live-active.png'
import OrdersImage from './order.png'
import OrdersActiveImage from './order-active.png'

const useStyles = makeStyles(
  {
    home: { backgroundImage: `url(${HomeImage})` },
    homeActive: { backgroundImage: `url(${HomeActiveImage})` },
    score: { backgroundImage: `url(${ScoreImage})` },
    scoreActive: { backgroundImage: `url(${ScoreActiveImage})` },
    live: { backgroundImage: `url(${LiveImage})` },
    liveActive: { backgroundImage: `url(${LiveActiveImage})` },
    orders: { backgroundImage: `url(${OrdersImage})` },
    ordersActive: { backgroundImage: `url(${OrdersActiveImage})` },
  },
  { name: 'IconTab' }
)

export default function IconTab ({
  type = 'home',
  active = false,
}) {
  const classes = useStyles()

  return (
    <Icon
      width={25}
      height={22}
      className={classes[`${type}${active ? 'Active': ''}`]}
    />
  )
}
