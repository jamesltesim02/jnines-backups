import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import TourFilterImage from './images/tour-filter.png'
import TourFilterBlackImage from './images/tour-filter-black.png'
import TourFilterRedImage from './images/tour-filter-red.png'

const useStyles = makeStyles(
  {
    white: { backgroundImage: `url(${TourFilterImage})` },
    black: { backgroundImage: `url(${TourFilterBlackImage})` },
    red: { backgroundImage: `url(${TourFilterRedImage})` }
  },
  { name: 'IconTourFilter' }
)

export default function IconTourFilter ({
  type = 'white'
}) {
  const classes = useStyles()

  return (
    <Icon
      size={17}
      className={classes[type]}
    />
  )
}
