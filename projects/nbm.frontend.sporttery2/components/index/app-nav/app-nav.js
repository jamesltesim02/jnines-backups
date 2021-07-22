import { inject, observer } from 'mobx-react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import { ag8 } from '../../../config/config.dev'

import mergeClass from '../../../utils/merge-class'

import M from '../../common/m'
import ButtonArea from '../../common/button-area'
import NavBar from '../../common/nav-bar'
import GrowHolder from '../../common/grow-holder'
import Ag8Link from '../../common/ag8-link'
import LocaledLink from '../../common/localed-router'

import { IconService, IconMember } from './icons'
import LogoImage from '../../../public/images/logo.png'

const useStyles = makeStyles(
  {
    toolbar: {
      paddingLeft: 16
    },
    logo: {
      width: 113,
      height: 34
    },
    buttons: {
      color: '#fff'
    },
    signbtn: {
      padding: 10,
      margin: '0 -5px'
    },
    inbtn: {
      marginLeft: -10
    },
    upbtn: {
      marginRight: -10
    }
  },
  { name: 'AppNav' }
)

function AppNav ({
  store: {
    member: { isLoged }
  }
}) {
  const classes = useStyles()

  return (
    <NavBar
      customLayout
      classes={{
        toolbar: classes.toolbar
      }}
    >
      <img
        src={LogoImage}
        className={classes.logo}
      />
      <GrowHolder />
      <div className={classes.buttons}>
        <Ag8Link href={ag8.service}>
          <IconButton color="inherit">
            <IconService />
          </IconButton>
        </Ag8Link>
        {
          isLoged ? (
            <LocaledLink href="/profile">
              <IconButton color="inherit">
                <IconMember />
              </IconButton>
            </LocaledLink>
          ) : (
            <>
              <Ag8Link href={ag8.signin}>
                <ButtonArea
                  inline
                  ripple="white"
                  className={
                    mergeClass(
                      classes.signbtn,
                      classes.inbtn
                    )
                  }
                >
                  <M id="sundires.signin" />
                </ButtonArea>
              </Ag8Link>
              <Ag8Link href={ag8.signup}>
                <ButtonArea
                  inline
                  ripple="white"
                  className={
                    mergeClass(
                      classes.signbtn,
                      classes.upbtn
                    )
                  }
                >
                  <M id="sundires.signup" />
                </ButtonArea>
              </Ag8Link>
            </>
          )
        }
      </div>
    </NavBar>
  )
}

export default inject('store')(
  observer(AppNav)
)
