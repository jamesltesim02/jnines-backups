import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  {
    root: {
      display: 'block',
      position: 'relative',
      '&::before,&::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        width: 3,
        height: '200%',
        backgroundColor: '#fff',
        top: '50%',
        left: '50%',
        transformOrigin: 'center center'
      },
      '&::before': {
        transform: 'translate(-50%, -50%) scale(.5) rotate(-45deg)'
      },
      '&::after': {
        transform: 'translate(-50%, -50%) scale(.5) rotate(45deg)'
      }
    }
  },
  { name: 'IconClose' }
)

export default function IconClose ({
  size = 20
}) {
  const classes = useStyles()

  return (
    <i
      className={classes.root}
      style={{
        width: size,
        height: size
      }}
    />
  )
}
