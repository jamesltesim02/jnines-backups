import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import SoccerImage from './soccer.png'
import BasketballImage from './basketball.png'
import TennisImage from './tennis.png'
import EsportsImage from './esports.png'
import HCImage from './hc.png'

const useStyles = makeStyles(
  {
    10: { backgroundImage: `url(${SoccerImage})` },
    11: { backgroundImage: `url(${BasketballImage})` },
    12: { backgroundImage: `url(${TennisImage})` },
    99: { backgroundImage: `url(${EsportsImage})` },
    // 901: { backgroundImage: `url(${HCImage})` },
    active: {}
  },
  { name: 'IconTab' }
)

export default function IconTab ({
  type = 10,
  size = 30,
  active = false,
}) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={`${classes[type]}${active ? ` ${classes.active}` : ''}`}
    />
  )
}
