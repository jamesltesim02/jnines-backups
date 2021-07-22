import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../../utils/merge-class'

import Tov2Image from './image/tov1.png';
import IconLogo from '../../icons/icon-logo/icon-logo'
// import IconQuickBet from '../../icons/icon-quick-bet'
import IconMember from '../../icons/icon-member'
import IconClose from '../../icons/icon-close'

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
    toVersion1: {
      position: 'relative',
      fontSize: 14,
      '& a': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        marginLeft: 5,
        '& img': {
          width: 22,
          height: 22,
        }
      },
      '& .tips': {
        position: 'absolute',
        top: 45,
        left: -5,
        display: 'flex',
        alignItems: 'center',
        height: 35,
        width: 185,
        backgroundColor: '#f2d195',
        color: '#181818',
        borderRadius: 15,
        padding: '0 15px',
        lineHeight: '35px',
        whiteSpace: 'nowrap',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -7,
          left: 30,
          display: 'inline-block',
          width: 0,
          height: 0,
          borderBottom: '7px solid #f2d195',
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
        },
        '& button': {
          marginLeft: 5,
        }
      }
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
  const [versionTip, setVersionTip] = React.useState(true)

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
          <div className={classes.toVersion1}>
            <a href={`${window.__AGYY_SPORTS_CONFIG__.V2_SITE_URL}${app.initSearch}`}>
              <img alt="" src={Tov2Image} />
            </a>
            {
              versionTip ? (
                <div className="tips">
                  <M id="others.toversion1" />
                  <button onClick={() => setVersionTip(false)}>
                    <IconClose />
                  </button>
                </div>
              ) : null
            }
          </div>
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
