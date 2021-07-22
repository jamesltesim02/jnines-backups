import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import TimeImage from './images/time.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${TimeImage})` }
  },
  { name: 'IconTime' }
)

export default function IconTime ({
  size = 13,
  style
}) {
  const classes = useStyles()
  return (
    <Icon
      size={size}
      style={style}
      className={classes.root}
    />
  )
}