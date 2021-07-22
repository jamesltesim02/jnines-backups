import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import VideoImage from './live-video.png'
import FlashImage from './live-flash.png'

const useStyles = makeStyles(
  {
    video: { backgroundImage: `url(${VideoImage})` },
    flash: { backgroundImage: `url(${FlashImage})` }
  },
  { name: 'IconMedia' }
)

export default function IconMedia ({ type }) {
  const classes = useStyles()
  return (
    <Icon
      width={8}
      height={10}
      className={classes[type]}
    />
  )
}
