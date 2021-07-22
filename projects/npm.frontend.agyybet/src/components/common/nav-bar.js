import React from 'react'
import { useIntl } from 'react-intl'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import BackButton from './back-button'

const useStyles = makeStyles(
  {
    root: {
      height: 45
    },
    navbar: {
      // top: 45,
      top: 'unset',
      boxShadow: 'none',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    transparent: {
      backgroundColor: 'transparent',
      '&::after, & $backbtn::after': {
        display: 'none'
      },
      '& $backbtn': {
        color: '#fff',
        '& > i > i': {
          borderColor: '#fff !important'
        }
      },
    },
    toolbar: {
      minHeight: 45,
      height: 45,
      padding: '0 10px',
    },
    growHolder: {
      flexGrow: 1
    },
    title: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: '0 48px',
      lineHeight: '45px',
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 600
    },
    backbtn: {
      marginLeft: -10,
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        right: 0,
        top: 0,
        height: '200%',
        width: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'right top',
        transform: 'scale(.5)'
      }
    }
  },
  { name: 'NavBar' }
)

function NavBar ({
  title = '',
  titleKey,
  className,
  toolbarClass,
  classes = {},
  titleClass,
  transparent = false,
  customLayout = false,
  fixed = true,
  children,
  onBack
}) {
  const styleClasses = useStyles()
  const intl = useIntl()

  return (
    <div className={mergeClass(styleClasses.root, classes.root)}>
      <AppBar
        color="inherit"
        position={fixed ? 'fixed' : 'relative'}
        className={
          mergeClass(
            styleClasses.navbar,
            classes.navbar,
            transparent ? styleClasses.transparent : null,
            className,
          )
        }
      >
        {
          !customLayout && (
            <Typography
              variant="h6"
              className={mergeClass(styleClasses.title, titleClass, classes.title)}
            >{titleKey ? intl.formatMessage({id:titleKey}) : title}</Typography>
          )
        }
        <Toolbar className={mergeClass(styleClasses.toolbar, toolbarClass, classes.toolbar)}>
          {
            customLayout
            ? children
            : (
              <>
                <BackButton
                  className={styleClasses.backbtn}
                  onBack={onBack}
                />
                <div className={styleClasses.growHolder} />
                {children}
              </>
            )
          }
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default NavBar
