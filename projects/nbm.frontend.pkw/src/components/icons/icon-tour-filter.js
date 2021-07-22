import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import TourFilterImage from './images/tour-filter.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${TourFilterImage})` }
  },
  { name: 'IconTourFilter' }
)

export default function IconTourFilter ({ size = 25 }) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={classes.root}
    />
  )
}
