import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import OperatingImage from './images/operating.png'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${OperatingImage})`
    }
  },
  { name: 'IconBetvalue' }
)

export default function IconBetvalue ({ size = 20 }) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={classes.root}
    />
  )
}
