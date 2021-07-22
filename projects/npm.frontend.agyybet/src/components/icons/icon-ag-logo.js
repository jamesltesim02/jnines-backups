import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import AgLogoImage from './images/ag-logo.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${AgLogoImage})` }
  },
  { name: 'IconAgLogo' }
)

export default function IconAgLogo () {
  const classes = useStyles()

  return (
    <Icon
      width={48}
      height={27}
      className={classes.root}
    />
  )
}
