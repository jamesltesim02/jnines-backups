import React from 'react'
import ButtonBase from '@material-ui/core/ButtonBase'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      display: 'block',
      width: '100%',
      color: 'inherit',
      textAlign: 'left',
      font: 'unset'
    },
    rippleDefault: {
      color: '#333'
    },
    rippleWhite: {
      color: '#fff'
    },
    rippleDark: {
      color: '#333'
    },
    inline: {
      display: 'inline-block',
      width: 'unset'
    }
  }, 
  { name: 'ButtonArea' }
)

function ButtonArea (
  {
    className = '',
    children,
    classes = {},
    ripple,
    inline = false,
    ...props
  },
  ref
) {
  const {
    root,
    rippleDefault,
    rippleWhite,
    rippleDark,
    inline: inlineClass
  } = useStyles()

  const rippleClas = ({
    white: rippleWhite,
    dark: rippleDark,
    default: rippleDefault
  })[ripple]|| rippleDefault


  return (
    <ButtonBase
      className={
        mergeClass(
          root,
          className,
          classes.root,
          inline ? inlineClass : null
        )
      }
      TouchRippleProps={{
        className: classes.ripple || rippleClas
      }}
      ref={ref}
      {...props}
    >{children}</ButtonBase>
  )
}

export default React.forwardRef(ButtonArea)
