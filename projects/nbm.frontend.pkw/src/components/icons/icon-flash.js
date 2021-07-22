import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import FlashImage from './images/flash.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${FlashImage})` }
  },
  { name: 'IconFlash' }
)

export default function IconFlash ({ size = 13 }) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={classes.root}
    />
  )
}
