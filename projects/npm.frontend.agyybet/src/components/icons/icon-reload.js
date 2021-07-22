import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import Icon from './icon'

import ReloadImage from './images/reload.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${ReloadImage})` }
  },
  { name: 'IconReload' }
)

export default function IconReload ({ reloading }) {
  const classes = useStyles()

  return (
    reloading
    ? <CircularProgress size={14} />
    : <Icon size={14} className={classes.root} />
  )
}
