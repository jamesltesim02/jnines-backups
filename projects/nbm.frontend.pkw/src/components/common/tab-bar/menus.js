import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'
// import toSignin from '../../../utils/to-signin'

import M from '../m'
import ButtonArea from '../button-area'

const useStyles = makeStyles(
  {
    root: {
      position: 'absolute',
      right: 43,
      marginTop: -12,
      zIndex: 1
    },
    cover: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100vw',
      height: '100vh'
    },
    list: {
      position: 'relative',
      width: 148,
      textAlign: 'center',
      height: 0,
      transition: 'all .2s ease-out',
      overflow: 'hidden',
      opacity: 0,
      transform: 'scale(.6)',
      transformOrigin: '126px 0',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        borderBottom: '8px solid #ddd',
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        top: 0,
        right: 10
      }
    },
    active: {
      height: 227,
      opacity: 1,
      transform: 'scale(1)'
    },
    item: {
      display: 'flex',
      lineHeight: '44px',
      color: '#444',
      backgroundColor: '#ddd',
      width: '100%',
      borderRadius: 0,
      position: 'relative',
      '&:first-child': {
        marginTop: 7,
        '&::after': {
          display: 'none'
        }
      },
      // 底部边框
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#504c50',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    badge: {
      position: 'absolute',
      width: 6,
      height: 6,
      backgroundColor: '#ff4a4a',
      top: '50%',
      right: 25,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%'
    }
  },
  { name: 'Menus' }
)

const menus = [
  'orders',
  'favorite',
  'results',
  'rules',
  'settings'
]

const Menus = ({
  open = false,
  store: {
    app,
    member,
    toast
  },
  onClose = () => {}
}) => {
  const classes = useStyles()
  const history = useHistory()
  const intl = useIntl()

  return (
    <div className={classes.root}>
      {
        open
        ? (
          <i
            className={classes.cover}
            onClick={onClose}
          />
        ) : null}
      <section
        className={
          mergeClass(
            classes.list,
            open ? classes.active : null
          )
        }
      >
        {
          menus.map(menu => (
            <ButtonArea
              key={menu}
              ripple="dark"
              className={classes.item}
              onClick={() => {
                onClose()
                if (['orders', 'favorite'].includes(menu) && !member.isLoged) {
                  toast.warning(intl.formatMessage({ id: 'message.needLogin' }))
                  // setTimeout(toSignin, 300)
                  return
                }
                history.push(`/${menu}`)
              }}
            >
              <M id={`menus.${menu}`} />
              {
                (
                  (
                    menu === 'orders'
                    &&
                    app.newOrder > 0
                  )
                  ||
                  (
                    menu === 'favorite'
                    &&
                    app.newFav > 0
                  )
                )
                ? <i className={classes.badge} />
                : null
              }
              
            </ButtonArea>
          ))
        }

        {/* {
          member.isLoged ? (
            <ButtonArea
              ripple="dark"
              className={classes.item}
              onClick={() => {
                member.setMemberInfo()
                toast.success('退出成功')
                onClose()
              }}
            >注销</ButtonArea>
          ) : (
            <ButtonArea
              ripple="dark"
              className={classes.item}
              onClick={toSignin}
            >立即登录</ButtonArea>
          )
        } */}
      </section>
    </div>
  )
}

export default inject('store')(
  observer(Menus)
)
