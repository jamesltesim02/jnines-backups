import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../../utils/merge-class'
import invalidScroll from '../../../utils/invalid-scroll'
import toSignin from '../../../utils/to-signin'

import withApi from '../../../api'

import IconReload from '../../icons/icon-reload'

import M from '../m'
import ButtonArea from '../button-area'
import LanguageChecker from './language-checker'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      position: 'absolute',
      right: -5,
      top: 35,
    },
    cover: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100vw',
      height: '100vh'
    },
    shadow: {
      padding: '0 10px',
      height: 0,
      transition: 'all .25s ease-out',
      overflow: 'hidden',
      opacity: 0,
      transformOrigin: '200px -10px',
      transform: 'scale(.6)',
    },
    active: {
      '& > $shadow': {
        height: 300,
        opacity: 1,
        transform: 'scale(1)',
        '&.loged': {
          height: 340
        }
      },
    },
    container: {
      width: 205,
      position: 'relative',
      marginTop: 10,
      background: '#eee',
      boxShadow: '0px 0px 10px 0px #333',
      borderRadius: 5,
      color: '#333',
      fontSize: 14,
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        borderBottom: '8px solid #fff',
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        top: -7,
        right: 9
      },
      '& > div, & > header': {
        background: '#fff'
      }
    },
    unloged: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      borderRadius: 5,
      '& > button': {
        borderRadius: 5,
        height: 65,
        textAlign: 'center'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        display: 'inline-block',
        width: 1,
        height: 24,
        transformOrigin: 'center',
        transform: 'translateY(-50%) scale(.5)',
        background: '#333'
      }
    },
    header: {
      padding: '15px 10px',
      '& > label': {
        display: 'block',
        fontSize: 13
      },
    },
    info: {
      display: 'flex',
      alignItems: 'center',
      '& > span': {
        flexGrow: 1,
        fontSize: 15
      },
      '& > button': {
        width: 'unset',
        padding: '3px 5px',
        borderRadius: 3,
        fontSize: 12,
        color: primary.main,
        border: `1px solid ${primary.main}`
      }
    },
    reload: {
      margin: '-12px 0',
      transform: 'translateY(-1px)'
    },
    menu: {
      marginTop: 5,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      overflow: 'hidden',
      '& > button, & > div': {
        position: 'relative',
        height: 40,
        paddingLeft: 10,
        '&::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 1,
          width: '200%',
          background: '#eee',
          transformOrigin: 'left bottom',
          transform: 'scale(.5)'
        }
      },
      '& > button:last-child::after': {
        display: 'none'
      }
    },
  }),
  { name: 'Menus' }
)

const Menus = ({
  open = false,
  store: {
    member,
    toast
  },
  api: { bet },
  onClose = () => {}
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const [reloading, setReloading] = React.useState(false)

  const handleReload = async () => {
    try {
      setReloading(true)
      const result = await bet.getBalance(member.tempToken)
      if (!result || !result.customerId) {
        member.setToken(null)
        member.setMemberInfo(null)
        return
      }
      toast.success(`刷新成功,您当前余额为: ${result.balance}`)
      member.setMemberInfo({
        userId: result.nbUserId,
        customerId: result.customerId,
        token: member.tempToken,
        balance: result.balance,
        currency: result.currency
      })
    } finally {
      setReloading(false)
    }
  }

  React.useEffect(
    () => {
      invalidScroll(open)
    },
    [open]
  )

  return (
    <div
      className={
        mergeClass(
          classes.root,
          open ? classes.active : null
        )
      }
    >
      {
        open
        ? (
          <i
            className={classes.cover}
            onClick={onClose}
          />
        ) : null
      }
      <div
        className={
          mergeClass(
            classes.shadow,
            member.isLoged ? 'loged' : null
          )
        }
      >
        <section className={classes.container}>
          {
            member.isLoged ? (
              <header className={classes.header}>
                <label>{member.memberInfo.customerId}</label>
                <div className={classes.info}>
                  <span>
                    ¥ {member.memberInfo.balance}
                    <IconButton
                      className={classes.reload}
                      onClick={handleReload}
                    >
                      <IconReload reloading={reloading} />
                    </IconButton>
                  </span>
                  <ButtonArea>
                    <M id="settings.deposit" />
                  </ButtonArea>
                </div>
              </header>
            ) : (
              <div className={classes.unloged}>
                <ButtonArea><M id="settings.signup" /></ButtonArea>
                <ButtonArea onClick={toSignin}><M id="settings.signin" /></ButtonArea>
              </div>
            )
          }
          <div className={classes.menu}>
            <ButtonArea>
              <M id="settings.promo" />
            </ButtonArea>
            <ButtonArea
              onClick={() => {
                onClose()
                if (member.isLoged) {
                  history.push('/tab/orders')
                  return
                }
                toSignin()
              }}
            >
              <M id="settings.myorder" />
            </ButtonArea>
            <ButtonArea
              onClick={() => {
                history.push('/rules')
                onClose()
              }}
            >
              <M id="settings.rules" />
            </ButtonArea>
            <LanguageChecker />
            <ButtonArea
              onClick={() => {
                history.push('/settings')
                onClose()
              }}
            >
              <M id="settings.setting" />
            </ButtonArea>
            {
              member.isLoged ? (
                <ButtonArea
                  onClick={() => {
                    member.setMemberInfo()
                    toast.success(
                      intl.formatMessage({ id: 'settings.sosuccess' })
                    )
                    onClose()
                  }}
                >
                  <M id="settings.signout" />
                </ButtonArea>
              ) : null
            }
          </div>
        </section>
      </div>
    </div>
  )
}

export default withApi('bet')(
  inject('store')(
    observer(Menus)
  )
)
