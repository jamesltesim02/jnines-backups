import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      verticalAlign: 'middle'
    }
  },
  { name: 'Icon' }
)

export default function Icon ({
  size,
  width = size,
  height = size,
  className,
  style = {},
  src,
  children
}) {
  const classes = useStyles()

  return (
    <i
      className={mergeClass(classes.root, className)}
      src={src}
      style={{
        width: width,
        height: height,
        ...style
      }}
    >{children}</i>
  )
}
