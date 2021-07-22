import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined'
import CircularProgress from '@material-ui/core/CircularProgress'
import Popover from '@material-ui/core/Popover'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'

import  { mainSiteUrls } from '../../../config/config.dev'

import mergeClass from '../../../utils/merge-class'
import { invalidScroll } from  '../../../utils/view-utils'
import toSignin from '../../../utils/to-signin'

import withApi from '../../../api'

import M from '../m'
import ButtonArea from '../button-area'
import LanguageChecker from './language-checker'

import SettingBlock from '../../other/setting-block'

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
      height: '100vh',
      zIndex: 9
    },
    shadow: {
      position: 'relative',
      padding: '0 10px',
      height: 0,
      transition: 'all .25s ease-out',
      overflow: 'hidden',
      opacity: 0,
      transformOrigin: '200px -10px',
      transform: 'scale(.6)',
      zIndex: 10
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
      },
      '& .icon-reload': {
        display: 'inline-flex',
        width: 'unset',
        padding: 6,
        borderRadius: '50%'
      },
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
      '& > .depositButton': {
        whiteSpace: 'nowrap',
        width: 'unset',
        padding: '3px 5px',
        borderRadius: 3,
        fontSize: 12,
        color: primary.main,
        border: `1px solid ${primary.main}`
      }
    },
    menu: {
      marginTop: 5,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      overflow: 'hidden',
      paddingBottom: 10,
      '& > button, & > div': {
        position: 'relative',
        height: 40,
        paddingLeft: 10,
        whiteSpace: 'nowrap',
      },
      '& > button::after': {
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
    settingPop: {
      marginTop: 22
    },
    pc: {
      position: 'static',
      '& button': {
        color: primary.main1,
        whiteSpace: 'nowrap'
      },
      '& .icon-reload': {
        padding: 0
      },
      '& $shadow': {
        opacity: 1,
        height: 'auto',
        transform: 'none',
        padding: '0 30px 0 0',
        overflow: 'visible',
        '& > $container': {
          boxShadow: 'none',
          fontSize: 12,
          margin: 0,
          width: 'auto',
          height: 60,
          display: 'flex',
          background: 'transparent',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          '& > header': {
            background: 'transparent'
          },
          '&::before': {
            display: 'none'
          }
        }
      },
      '& .icon-button': {
        fontSize: 17,
        width: 35,
        height: 35,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
      },
      '& $header': {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: 0,
        color: primary.main1,
        '& > label': {
          fontWeight: 600,
          paddingRight: 15,
          paddingLeft: 10
        },
      },
      '& .depositButton, & .signup': {
        background: 'linear-gradient(90deg, #e1ae74, #efc28e)',
        border: 'none',
        color: '#161616'
      },
      '& $info': {
        lineHeight: '30px',
        '& > span': {
          fontWeight: 600,
          whiteSpace: 'nowrap',
          color: primary.main1,
        },
        '& > .depositButton, & .signoutButton': {
          padding: '0 15px',
          lineHeight: '28px',
        }
      },
      '& $menu': {
        position: 'absolute',
        right: 292,
        top: 40,
        zIndex: 10,
        opacity: 0,
        marginTop: 0,
        overflow: 'hidden',
        transformOrigin: '80px -10px',
        transform: 'scale(.4)',
        boxShadow: '0px 0px 10px 0px #333',
        paddingBottom: 0,
        '& > button': {
          padding: '0 10px',
        },
        '&.active': {
          height: 120,
          opacity: 1,
          transition: 'all .25s ease-out',
          transform: 'scale(1)',
          overflow: 'visible',
        },
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
      },
      '& $unloged': {
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        '&::after': {
          display: 'none'
        },
        '& > button': {
          height: 30,
          padding: '0 15px',
        },
        '& > .signup': {
          borderRadius: 5,
          border: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            boxSizing: 'border-box',
            display: 'block',
            borderRadius: 10,
            width: '200%',
            height: '200%',
            transformOrigin: 'left top',
            transform: 'scale(.5)'
          }
        }
      },
    },
    full: {
      '& $menu': {
        position: 'static',
        display: 'flex',
        flexDirection: 'row-reverse',
        opacity: 1,
        transform: 'none',
        boxShadow: 'none',
        background: 'transparent',
        '& > button, & > div': {
          height: 60,
          padding: '0 7px',
          width: 'auto',
          '&::after': {
            display: 'none'
          }
        },
        '&::before': {
          display: 'none'
        }
      }
    },
  }),
  { name: 'Menus' }
)

const CURRENCY_MAP = {
  1: '¥',
  2: '$',
  101: '¥'
}

const MENU_LIST = [
  // 优惠活动
  // {
  //   url: null,
  //   text: 'settings.promo',
  //   needLogin: false,
  //   pc: false
  // },
  // 我的注单
  {
    url: '/tab/orders',
    text: 'settings.myorder',
    needLogin: true,
    pc: true
  },
  // 玩法规则
  {
    url: '/rules',
    text: 'settings.rules',
    needLogin: false,
    pc: true
  },
  {
    url: '/specialnote',
    text: 'settings.specialNote',
    needLogin: false,
    pc: true
  },
  // 设置
  {
    url: '/settings',
    text: 'settings.setting',
    needLogin: false,
    pc: true
  }
]

const Menus = ({
  pcMode = false,
  open = false,
  store: {
    app,
    member,
    toast
  },
  api: { bet },
  onClose = () => {}
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const menuAnchor = React.useRef(null)
  const rootAnchor = React.useRef(null)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [settingOpen, setSettingOpen] = React.useState(false)

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
      toast.success(
        intl.formatMessage(
          { id: 'others.balanceReloaded' },
          { balance: result.balance }
        )
      )
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

  const handleMenuClick = menu => {
    setMenuOpen(false)
    onClose()
    if (menu.needLogin && !member.isLoged) {
      toSignin()
      return
    }
    if (
      app.pcMode
      &&
      menu.text === 'settings.setting'
    ) {
      setSettingOpen(true)
      return
    }
    history.push(menu.url)
  }

  const handleToMainSite = url => {
    const params = new URLSearchParams(app.initSearch)
    window.top.location = new URL(
      url,
      (
        params.get('origin')
        ||
        app.origin
        ||
        window.__AGYY_SPORTS_CONFIG__.DEFAULT_ORIGIN
      )
    )
  }

  React.useEffect(
    () => {
      invalidScroll(open)
      return () => invalidScroll(false)
    },
    [open]
  )

  const fullMode = app.pcMode && (!member.isLoged || app.docWidth > 1380)

  // const signoutButton = member.isLoged ? (
  //   <ButtonArea
  //     className="signoutButton"
  //     onClick={() => {
  //       member.setMemberInfo()
  //       toast.success(
  //         intl.formatMessage({ id: 'settings.sosuccess' })
  //       )
  //       onClose()
  //     }}
  //   >
  //     <M id="settings.signout" />
  //   </ButtonArea>
  // ) : null

  return (
    <div
      className={
        mergeClass(
          classes.root,
          pcMode ? classes.pc : null,
          fullMode ? classes.full : null,
          (!pcMode && open) ? classes.active : null
        )
      }
    >
      {
        open ? (
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
              // 账号及余额
              <header className={classes.header}>
                {/* 账号 */}
                <label
                  onClick={() => handleToMainSite(mainSiteUrls.member)}
                >{member.memberInfo.customerId}</label>
                <div className={classes.info}>
                  {/* 余额 */}
                  <span>
                    {CURRENCY_MAP[member.memberInfo.currency]}{member.memberInfo.balance}
                    <ButtonArea
                      className="icon-button icon-reload"
                      onClick={handleReload}
                    >
                      {
                        reloading
                        ? <CircularProgress size={14} color="inherit" />
                        : <RefreshOutlinedIcon fontSize="inherit" />
                      }
                    </ButtonArea>
                  </span>
                  {/* 存款 */}
                  <ButtonArea
                    className="depositButton"
                    ripple="dark"
                    onClick={() => handleToMainSite(mainSiteUrls.deposit)}
                  >
                    <M id="settings.deposit" />
                  </ButtonArea>
                  {/* 注销 */}
                  {/* {pcMode ? signoutButton : null} */}
                </div>
              </header>
            ) : (
              <div className={classes.unloged}>
                {/* 注册 */}
                <ButtonArea
                  onClick={toSignin}
                  className="signup"
                ><M id="settings.signup" /></ButtonArea>
                {/* 登录 */}
                <ButtonArea
                  className="signin"
                  onClick={toSignin}
                ><M id="settings.signin" /></ButtonArea>
              </div>
            )
          }
          {/* PC版本下的语言切换 */}
          {
            pcMode
            ? (
              <LanguageChecker
                ref={rootAnchor}
                pcMode={pcMode}
              />
            )
            : null
          }
          {
            pcMode && !fullMode
            ? (
              <>
                <ButtonArea
                  ref={menuAnchor}
                  className="icon-button"
                  onClick={() => setMenuOpen(true)}
                >
                  <SettingsOutlinedIcon fontSize="inherit" />
                </ButtonArea>
                <Popover
                  anchorEl={menuAnchor.current}
                  open={menuOpen}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                    <MenuList>
                      {
                        MENU_LIST.map(menu => (
                          pcMode && !menu.pc
                          ? null
                          : (
                            <MenuItem
                              key={menu.text}
                              onClick={() => handleMenuClick(menu)}
                            >
                              <M id={menu.text} />
                            </MenuItem>
                          )
                        ))
                      }
                    </MenuList>
                  </ClickAwayListener>
                </Popover>
              </>
            )
            : (
              <div className={mergeClass(classes.menu, pcMode && open ? 'active' : null)}>
                {
                  MENU_LIST.map(menu => (
                    pcMode && !menu.pc
                    ? null
                    : (
                      <ButtonArea
                        key={menu.text}
                        onClick={() => handleMenuClick(menu)}
                      >
                        <M id={menu.text} />
                      </ButtonArea>
                    )
                  ))
                }
                {/* 语言切换 */}
                {
                  pcMode
                  ? null
                  : <LanguageChecker pcMode={pcMode} />
                }
                {/* 注销 */}
                {/* {!pcMode ? signoutButton : null} */}
              </div>
            )
          }
        </section>
      </div>
      <Popover
        anchorEl={rootAnchor.current}
        open={settingOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ root: classes.settingPop }}
      >
        <ClickAwayListener onClickAway={() => setSettingOpen(false)}>
          <SettingBlock onClose={() => setSettingOpen(false)} />
        </ClickAwayListener>
      </Popover>
    </div>
  )
}

export default withApi('bet')(
  inject('store')(
    observer(Menus)
  )
)
