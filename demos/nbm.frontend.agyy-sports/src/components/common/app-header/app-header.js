import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../../utils/merge-class'

import IconLogo from '../../icons/icon-logo/icon-logo'
// import IconQuickBet from '../../icons/icon-quick-bet'
import IconMember from '../../icons/icon-member'

import M from '../m'
import ButtonArea from '../button-area'
import Tabbar from '../tabbar'

import Menus from './menus'

const useStyles = makeStyles(
  {
    container: {
      height: 45
    },
    root: {
      position: 'fixed',
      left: 0,
      zIndex: 1101,
      height: 45,
      width: '100vw',
    },
    mainHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 121px 1fr'
    },
    logo: {
      paddingLeft: 10,
      lineHeight: '45px'
    },
    opr: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        '& > label': {
          fontSize: 12,
          opacity: .8,
          lineHeight: '12px',
        },
        '& > var': {
          fontSize: 13,
          lineHeight: '13px'
        }
      },
      '& > button': {
        marginBottom: 1
      }
    },
    pc: {
      height: 60,
      '& > $root': {
        height: 60,
        backgroundColor: '#161616',
        display: 'grid',
        gridTemplateColumns: '1fr 220px 1fr',
        boxSizing: 'content-box'
      },
      '& $mainHeader': {
        display: 'flex',
        '& > button': {
          width: 'auto'
        }
      },
      '& $logo': {
        lineHeight: '30px',
        paddingLeft: 30,
        display: 'flex',
        alignItems: 'center'
      }
    }
  },
  { name: 'AppHeader' }
)

const AppHeader = ({
  store: {
    app,
    member
  }
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [menuAvailable, setMenuAvailable] = React.useState(false)

  if (app.purePage) {
    return null
  }

  return (
    <header
      className={
        mergeClass(
          classes.container,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <section className={`block-header ${classes.root}`}>
        <div className={classes.mainHeader}>
          <ButtonArea
            className={classes.logo}
            ripple="white"
            onClick={() => history.push('/')}
          >
            <IconLogo pcMode={app.pcMode} />
          </ButtonArea>
          <div></div>
          {/* <ButtonArea ripple="white">
            <IconQuickBet pcMode={app.pcMode} />
          </ButtonArea> */}
          {
            app.pcMode
            ? null
            : (
              <div className={classes.opr}>
                {
                  member.isLoged ? (
                    <div>
                      <label><M id="common.balance" />:</label>
                      <var>{member.memberInfo.balance}</var>
                    </div>
                  ) : null
                }
                <IconButton
                  color="inherit"
                  onClick={() => setMenuAvailable(true)}
                >
                  <IconMember loged={member.isLoged} />
                </IconButton>
              </div>
            )
          }
        </div>
        {app.pcMode ? <Tabbar pcMode /> : null}
        <Menus
          open={!app.pcMode && menuAvailable}
          pcMode={app.pcMode}
          onClose={() => setMenuAvailable(false)}
        />
      </section>
    </header>
  )
}

export default inject('store')(
  observer(AppHeader)
)
