import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import InfoImage from './images/info.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${InfoImage})` }
  },
  { name: 'IconInfo' }
)

export default function IconInfo () {
  const classes = useStyles()

  return (
    <Icon
      size={11}
      className={classes.root}
    />
  )
}
