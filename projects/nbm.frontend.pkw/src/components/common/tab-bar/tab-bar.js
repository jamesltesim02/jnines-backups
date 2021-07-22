import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory, useLocation } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { quit } from '../../../utils/cocos-utils'

import IconSport from '../../icons/icon-sport'
import IconOperating from '../../icons/icon-operating'
import IconClose from '../../icons/icon-close'

import M from '../m'
import Menus from './menus'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      height: 50
    },
    nav: {
      display: 'flex',
      background: primary.background,
      position: 'fixed',
      width: '100%',
      top: 0,
      left: 0,
      zIndex: 3
    },
    tabs: {
      overflow: 'visible',
      width: 'calc(100% - 90px)'
    },
    flexContainer: {
      position: 'relative',
      // 底部边框
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#585858',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
    },
    tab: {
      padding: '0 5px',
      minHeight: 50,
      minWidth: 65,
      flexGrow: 1,
      opacity: 1,
      color: '#bdbdbd',
      '&::before,&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
      },
      // 底部边框
      '&::before': {
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#585858',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
      // 按钮右边边框
      '&::after': {
        right: 0,
        top: 0,
        width: 1,
        height: '200%',
        backgroundColor: '#292829',
        transformOrigin: 'center top',
        transform: 'scale(.5)'
      },
      '&:last-child::after': {
        display: 'none'
      }
    },
    selected: {
      color: '#fff',
      '& > .MuiTab-wrapper': {
        color: primary.frontend
      }
    },
    wrapper: {
      fontSize: 16,
      flexDirection: 'row'
    },
    labelIcon: {
      '& .MuiTab-wrapper > *:first-child': {
        marginRight: 2,
        marginBottom: 0
      }
    },
    indicator: {
      height: 8,
      backgroundColor: 'transparent',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        height: 20,
        width: 20,
        border: '1px solid #585858',
        background: '#404040',
        left: '50%',
        zIndex: 1,
        transformOrigin: 'center center',
        transform: 'translate(-50%, -2px) scale(.5) rotate(45deg)'
      }
    },
    buttons: {
      position: 'relative',
      lineHeight: '50px',
      paddingRight: 6,
      textAlign: 'right',
      width: 90,
      '& > button': {
        color: '#fff',
        padding: 8
      },
      '&::before,&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
      },
      // 按钮右边边框
      '&::before': {
        left: 0,
        top: 0,
        width: 1,
        height: '200%',
        backgroundColor: '#292829',
        transformOrigin: 'center top',
        transform: 'scale(.5)'
      },
      '&::after': {
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#585858',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    badge: {
      position: 'absolute',
      width: 8,
      height: 8,
      backgroundColor: '#FF4A4A',
      top: 7,
      right: 3,
      borderRadius: '50%'
    }
  }),
  { name: 'TabBar' }
)

const tabs = [
  {
    name: 'all',
    url: '/matchs/all'
  },
  {
    name: '10',
    url: '/matchs/10'
  },
  {
    name: '11',
    url: '/matchs/11'
  },
  {
    name: '99',
    url: '/matchs/99'
  }
]

/**
 * 判断路由地址是否在tabs列表中
 * @param {string} pathname 路由地址
 */
const isAvailable = (pathname) => tabs.findIndex(({ url }) => url === pathname) !== -1

const TabBar = ({
  store: { app }
}) => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const [menuAvailable, setMenuAvailable] = React.useState(false)

  const [tabValue, setTabValue] = React.useState(tabs[0].url)

  React.useEffect(
    () => {
      const pathname  = location.pathname.replace(/[?#].*/i, '')
      const isava = isAvailable(pathname)

      if (isava) {
        setTabValue(pathname)
      }
      if( tabs.findIndex(({ url }) => url === pathname) > -1) {
        setTabValue(pathname)
      }
    },
    [location]
  )

  return (
    <header className={classes.root}>
      <nav
        className={classes.nav}
      >
        <Tabs
          value={tabValue}
          variant="scrollable"
          scrollButtons="auto"
          onChange={(e, value) => history.replace(value)}
          classes={{
            root: classes.tabs,
            indicator: classes.indicator,
            flexContainer: classes.flexContainer
          }}
        >
          {
            tabs.map(({ name, url }) => (
              <Tab
                key={name}
                label={<M id={`sports.${name}`} />}
                value={url}
                icon={
                  <IconSport
                    type={name}
                    active={tabValue === url}
                  />
                }
                classes={{
                  root: classes.tab,
                  wrapper: classes.wrapper,
                  labelIcon: classes.labelIcon,
                  selected: classes.selected,
                }}
              />
            ))
          }
        </Tabs>
        <div className={classes.buttons}>
          <IconButton onClick={() => setMenuAvailable(true)}>
            <IconOperating />
            {
              (
                app.newOrder > 0
                ||
                app.newFav > 0
              )
              ? <i className={classes.badge} />
              : null 
            }
            <i />
          </IconButton>
          <IconButton onClick={() => quit()}><IconClose /></IconButton>
          <Menus
            open={menuAvailable}
            onClose={() => setMenuAvailable(false)}
          />
        </div>
      </nav>
      </header>
  )
}

export default inject('store')(
  observer(TabBar)
)
