import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import VideoImage from './images/video.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${VideoImage})` }
  },
  { name: 'IconVideo' }
)

export default function IconVideo ({ size = 13 }) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={classes.root}
    />
  )
}
