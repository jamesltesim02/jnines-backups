import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import ShakeImage from './images/shake.png'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${ShakeImage})`
    }
  },
  { name: 'IconShake' }
)

export default function IconShake ({
  size = 15,
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