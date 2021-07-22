import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      position: 'relative',
      verticalAlign: 'middle',
      // transition: 'all .2s ease-out'
    },
    arrow: {
      display: 'inline-block',
      position: 'absolute',
      width: '140%',
      height: '140%',
      borderStyle: 'solid',
      top: '50%',
      left: '56%',
      borderBottom: 0,
      borderRight: 0,
      transform: 'translate(-45%, -50%) rotate(-45deg) scale(.5)'
    },
    top: {
      transform: 'rotate(90deg)'
    },
    bottom: {
      transform: 'rotate(270deg)'
    },
    right: {
      transform: 'rotate(180deg)'
    },
  },
  { name: 'IconArrow' }
)

const IconArrow = ({
  size = 20,
  direction = 'left',
  color = '#333',
  weight = 1
}) => {
  const classes = useStyles()

  return (
    <i
      className={
        mergeClass(
          classes.root,
          classes[direction]
        )
      }
      style={{
        width: size,
        height: size
      }}
    >
      <i
        className={classes.arrow}
        style={{
          borderColor: color,
          borderTopWidth: 2 * weight,
          borderLeftWidth: 2 * weight
        }}
      />
    </i>
  )
}

export default IconArrow
