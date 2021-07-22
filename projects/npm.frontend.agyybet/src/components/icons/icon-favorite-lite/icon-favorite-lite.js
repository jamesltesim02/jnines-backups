import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import LightImage from './light.png'
import LightActiveImage from './light-active.png'
import DarkImage from './dark.png'
import DarkActiveImage from './dark-active.png'

const useStyles = makeStyles(
  {
    light: { backgroundImage: `url(${LightImage})`},
    lightActive: { backgroundImage: `url(${LightActiveImage})`},
    dark: { backgroundImage: `url(${DarkImage})`},
    darkActive: { backgroundImage: `url(${DarkActiveImage})`}
  },
  { name: 'IconFavoriteLite' }
)

export default function IconFavoriteLite ({
  type='light',
  active = false,
  size=15
}) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={classes[`${type}${active ? 'Active' : ''}`]}
    />
  )
}
