import React from 'react'
import { useIntl } from 'react-intl'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import GrowHolder from './grow-holder'
import BackButton from './back-button'

const useStyles = makeStyles(
  {
    root: {
      height: 50
    },
    navbar: {
      boxShadow: 'none',
      '& .HC-BackButton': {
        marginLeft: -10
      }
    },
    transparent: {
      backgroundColor: 'transparent'
    },
    toolbar: {
      minHeight: 50,
      height: 50,
      padding: '0 10px',
    },
    title: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: '0 48px',
      lineHeight: '50px',
      textAlign: 'center'
    }
  },
  { name: 'NavBar' }
)

function NavBar ({
  intl = useIntl(),
  title = '',
  titleKey,
  transparent = false,
  className,
  toolbarClass,
  classes = {},
  titleClass,
  customLayout = false,
  children,
  onBack
}) {
  const styleClasses = useStyles()


  return (
    <div className={mergeClass(styleClasses.root, classes.root)}>
      <AppBar
        className={
          mergeClass(
            styleClasses.navbar, 
            className,
            classes.navbar,
            transparent ? styleClasses.transparent : null
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
                <BackButton onBack={onBack} />
                <GrowHolder />
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
