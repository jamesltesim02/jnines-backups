import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      fontSize: 12,
      lineHeight: '12px',
    },
  },
  { name: 'SmallFont' }
)

export default function SmallFont ({
  tag = 'span',
  className,
  size = 12,
  origin = 'center',
  children
}) {
  const { root } = useStyles()

  return React.createElement(
    tag,
    {
      className: mergeClass(
        root,
        className
      ),
      style: {
        transform: `scale(${Math.max(size, 1) / 12})`,
        transformOrigin: origin
      }
    },
    children
  )
}