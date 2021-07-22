import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import AgLogoImage from './images/j9-logo.tiny.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${AgLogoImage})` }
  },
  { name: 'IconJ9Logo' }
)

export default function IconJ9Logo () {
  const classes = useStyles()

  return (
    <Icon
      width={35}
      height={35}
      className={classes.root}
    />
  )
}
