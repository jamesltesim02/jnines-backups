import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import ClockImage from './images/clock.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${ClockImage})` }
  },
  { name: 'IconClock' }
)

export default function IconClock () {
  const classes = useStyles()

  return (
    <Icon
      width={20}
      height={22}
      className={classes.root}
    />
  )
}
