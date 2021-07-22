import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      position: 'relative',
      display: 'inline-block',
      width: 50,
      height: 22,
      backgroundColor: '#eee',
      borderRadius: 11,
      transition: 'all .3s ease-in-out',
      overflow: 'hidden',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        display: 'inline-block',
        transition: 'all .3s ease-in-out'
      },
      '&::before': {
        backgroundColor: 'transparent',
        top: 0,
        left: -28,
        width: '100%',
        height: '100%',
        borderRadius: 100,
      },
      '&::after': {
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: '#bbb',
        left: 1,
        top: 1
      },
    },
    active: {
      '&::before': {
        left: 0,
        backgroundColor: primary.main
      },
      '&::after': {
        left: 27,
        backgroundColor: '#fff'
      }
    }
  }),
  { name: 'IconToggle' }
)

const IconToggle = ({
  checked = false,
  ...props
}) => {
  const classes = useStyles()

  return (
    <i
      className={
        mergeClass(
          classes.root,
          checked ? classes.active : null
        )
      }
      {...props}
    />
  )
}

export default IconToggle