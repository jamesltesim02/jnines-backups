import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'middle',
      '&::before, &::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
      },
      '&::before': {
        height: `${14/22*100}%`,
        width: `${28/22*100}%`,
        borderLeft: '3px solid transparent',
        borderBottom: '3px solid transparent',
        transform: 'scale(.5) translate(-25%, 40%) rotate(-45deg)',
        zIndex: 2,
        transition: 'all .3s ease-in-out',
      },
      '&::after': {
        width: '200%',
        height: '200%',
        borderRadius: '50%',
        border: '3px solid #666',
        transform: 'translate(-25%, -25%) scale(.5)',
        transition: 'all .3s ease-in-out',
        zIndex: 1
      }
    },
    active: {
      '&::before': {
        borderLeftColor: '#fff',
        borderBottomColor: '#fff'
      },
      '&::after': {
        background: '#14805e',
        borderColor: '#14805e !important'
      }
    }
  },
  { name: 'IconRadio' }
)

const IconRadio = ({
  size = 22,
  className,
  classes = {},
  active
}) => {
  const cs = useStyles()

  return (
    <i
      className={
        mergeClass(
          cs.root,
          classes.root,
          className,
          active ? cs.active : null,
          active ? classes.active : null
        )
      }
      style={{
        width: size,
        height: size
      }}
    />
  )
}

export default IconRadio
