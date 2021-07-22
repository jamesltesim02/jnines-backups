import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    '@keyframes inputblink': {
      'from, 50%, to': {
        opacity: 0
      },
      '25%, 75%': {
        opacity: 1
      }
    },
    root: {
      position: 'relative',
      display: 'inline-flex',
      width: 110,
      height: 30,
      border: `1px solid #bababa`,
      borderRadius: 3,
      padding: '0 8px',
      alignItems: 'center',
      '& > var': {
        display: 'inline-block',
        position: 'relative',
        color: primary.main,
        fontSize: 16,
        height: 22,
        lineHeight: '25px',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          right: 0,
          display: 'none',
          width: 3,
          height: 32,
          background: primary.main,
          transform: 'translateY(-50%) scale(.5)',
          animation: '$inputblink linear 1.5s infinite'
        }
      },
      '& > label': {
        position: 'absolute',
        width: '100%',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontSize: 12,
        lineHeight: '12px',
        color: '#aaa'
      }
    },
    focused: {
      border: `1px solid ${primary.main}`,
      '& > var': {
        paddingRight: 3,
        '&::after': {
          display: 'block'
        }
      }
    },
    valued: {
      border: `1px solid ${primary.main}`,
      justifyContent: 'center',
      '& > var': {
        display: 'inline-block',
      },
      '& > label': {
        display: 'none'
      }
    },
    disabled: {
      '& > var::after': {
        display: 'none'
      }
    },
  }),
  { name: 'InputBox' }
)

const InputBox = ({
  value = '',
  placeholder = '',
  focused = false,
  disabled = false,
  onFocus = () => {}
}) => {
  const classes = useStyles()

  return (
    <span
      className={
        mergeClass(
          classes.root,
          focused ? classes.focused : null,
          disabled ? classes.disabled : null,
          value !== '' ? classes.valued : null
        )
      }
      onClick={disabled ? null : onFocus}
    >
      <var>{value}</var>
      <label>{placeholder}</label>
    </span>
  )
}

export default InputBox
