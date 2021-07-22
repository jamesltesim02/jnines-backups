import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import FavoriteImage from './images/favorite.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${FavoriteImage})` }
  },
  { name: 'IconFavorite' }
)

export default function IconFavorite ({
  size = 55
}) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      className={classes.root}
    />
  )
}
