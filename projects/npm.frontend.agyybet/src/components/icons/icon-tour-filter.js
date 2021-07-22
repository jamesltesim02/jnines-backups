import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import TourFIlterImage from './images/tour-filter.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${TourFIlterImage})` }
  },
  { name: 'IconTourFilter' }
)

export default function IconTourFilter () {
  const classes = useStyles()

  return (
    <Icon
      size={17}
      className={classes.root}
    />
  )
}
