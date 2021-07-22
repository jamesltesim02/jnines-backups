import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import IconLogo from '../../icons/icon-logo'
import IconQuickBet from '../../icons/icon-quick-bet'
import IconMember from '../../icons/icon-member'

import M from '../m'
import ButtonArea from '../button-area'

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
      width: '100%',
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
    }
  },
  { name: 'AppHeader' }
)

const AppHeader = ({
  store: { member }
}) => {
  const classes = useStyles()

  const [menuAvailable, setMenuAvailable] = React.useState(false)

  return (
    <header className={classes.container}>
      <section className={`block-header ${classes.root}`}>
        <div className={classes.logo}>
          <IconLogo />
        </div>
        <ButtonArea>
          <IconQuickBet />
        </ButtonArea>
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
            <IconMember />
          </IconButton>
        </div>
        <Menus
          open={menuAvailable}
          onClose={() => setMenuAvailable(false)}
        />
      </section>
    </header>
  )
}

export default inject('store')(
  observer(AppHeader)
)
