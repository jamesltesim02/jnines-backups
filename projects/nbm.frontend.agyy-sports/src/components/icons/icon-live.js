import React from 'react'
import {makeStyles} from '@material-ui/core/styles'

import Icon from './icon'

import LiveImageActive from './images/LIVE-active.svg'
import LiveImage from './images/LIVE-default.svg'


const useStyles = makeStyles(
  {
    root: {
      backgroundImage: active => {
        return `url(${ active ? LiveImageActive : LiveImage })`
      }
    }
  },
  {name: 'IconLive'}
)

export default function IconLive({
  active = false,
  size = 55
}) {
  const classes = useStyles(active)

  return (
    <Icon
      size={size}
      className={classes.root}
    />
  )
}