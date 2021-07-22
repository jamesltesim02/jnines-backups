import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import LogoImage from './logo_j9.tiny.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${LogoImage})` },
  },
  { name: 'IconLogo' }
)

export default function IconLogo () {
  const classes = useStyles()

  return (
    <Icon
      width={130}
      height={30}
      className={classes.root}
    />
  )
}
