import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      textAlign: 'center',
      border: '1px solid #ccc',
      transition: 'all .3s ease-in-out',
      fontSize: 12,
      '&::before, &::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        right: 0,
        bottom: 0,
        transition: 'all .3s ease-in-out'
      },
      '&::before': {
        border: '10px solid transparent',
      },
      '&::after': {
        width: 9,
        height: 5,
        borderBottom: '1px solid #fff',
        borderLeft: '1px solid #fff',
        right: 1,
        bottom: 4,
        transform: 'rotate(-45deg)'
      }
    },
    checked: {
      position: 'relative',
      border: `1px solid ${primary.main} !important`,
      color: primary.main,
      '&::before': {
        borderBottomColor: `${primary.main} !important`,
        borderRightColor: `${primary.main} !important`
      },
    }
  }),
  { name: 'FilterItem' }
)

const FilterItem = ({
  children,
  checked = false,
  ...props
}) => {
  const classes = useStyles()

  return (
    <ButtonArea
      className={
        mergeClass(
          classes.root,
          checked ? classes.checked : null
        )
      }
      {...props}
    >
      {children}
    </ButtonArea>
  )
}

export default FilterItem
