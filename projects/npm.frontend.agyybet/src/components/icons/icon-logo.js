import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import LogoImage from './images/logo.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${LogoImage})` }
  },
  { name: 'IconLogo' }
)

export default function IconLogo () {
  const classes = useStyles()

  return (
    <Icon
      width={69}
      height={22}
      className={classes.root}
    />
  )
}
