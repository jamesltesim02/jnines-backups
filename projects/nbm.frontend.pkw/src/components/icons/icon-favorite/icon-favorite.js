import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import FavoriteImage from './favorite.png'
import FavoriteActiveImage from './favorite-active.png'

const useStyles = makeStyles(
  {
    root: { marginTop: -2 },
    default: { backgroundImage: `url(${FavoriteImage})` },
    active: { backgroundImage: `url(${FavoriteActiveImage})` }
  },
  { name: 'IconFavorite' }
)

const IconFavorite = ({
  size = 15,
  active = false
}) => {
  const classes = useStyles()

  return (
    <Icon
      width={size}
      height={size * 0.9333333333333333}
      className={
        `${
          classes.root
        } ${
          active ? classes.active : classes.default
        }`
      }
    />
  )
}

export default IconFavorite
