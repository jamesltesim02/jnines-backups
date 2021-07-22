import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import QxcTrashImage from './images/qxc-trash.png'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${QxcTrashImage})`
    }
  },
  { name: 'IconQxcTrash' }
)

export default function IconQxcTrash ({
  size = 20,
  style
}) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      style={style}
      className={classes.root}
    />
  )
}