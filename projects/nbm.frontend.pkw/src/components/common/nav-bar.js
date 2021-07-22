import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import M from './m'
import BackButton from './back-button'

const useStyles = makeStyles(
  {
    root: {
      height: 50
    },
    navbar: {
      boxShadow: 'none'
    },
    transparent: {
      backgroundColor: 'transparent'
    },
    back: {
      marginLeft: -10
    },
    toolbar: {
      minHeight: 50,
      height: 50,
      padding: '0 10px'
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
  title = '',
  titleKey,
  className,
  classes = {},
  customLayout = false,
  children,
  transparent,
  onBack
}) {
  const cs = useStyles()


  return (
    <div className={mergeClass(cs.root, classes.root)}>
      <AppBar
        className={
          mergeClass(
            className,
            classes.navbar,
            cs.navbar,
            transparent ? cs.transparent : null
          )
        }
      >
        {
          !customLayout && (
            <Typography
              variant="h6"
              className={mergeClass(cs.title,  classes.title)}
            >
              {titleKey ? <M id={titleKey} /> : title}
            </Typography>
          )
        }
        <Toolbar className={mergeClass(cs.toolbar, classes.toolbar)}>
          {
            customLayout
            ? children
            : (
              <>
                <BackButton
                  className={cs.back}
                  onBack={onBack}
                />
                <div style={{ flexGrow: 1 }} />
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
