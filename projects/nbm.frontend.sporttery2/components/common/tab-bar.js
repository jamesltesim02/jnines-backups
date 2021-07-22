import React from 'react'
import { observer } from 'mobx-react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import M from './m'
import { withLocaledRouter } from './localed-router'

import {
  IconHome,
  IconOrder,
  IconProfile,
  IconScore
} from '../icons/icon-tab'

const useStyles = makeStyles(
  {
    tabs: {
      position: 'fixed',
      width: '100%',
      bottom: 0,
      zIndex: 1100,
      opacity: 0,
      transform: 'translateY(100%)',
      transition: 'all .3s ease-in-out',
      backgroundColor: '#fff',
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, .05)'
    },
    tabsAvailable: {
      opacity: 1,
      transform: 'translateY(0%)'
    },
    item: {
      fontSize: 12,
      lineHeight: '12px',
      minHeight: '42px',
      padding: '8px 12px 6px 12px'
    },
    indicator: {
      display: 'none',
      opacity: 0
    },
    holder: {
      height: 58,
      boxShadow: 'none',
      background: 'transparent',
      borderRadius: 0,
      color: 'transparent',
      transition: 'none'
    }
  },
  { name: 'TabBar' }
)

export const tabs = [
  {
    url: '/',
    text: "common.tabs.home",
    icon: IconHome
  },
  {
    url: '/score',
    text: "common.tabs.score",
    icon: IconScore
  },
  {
    url: '/betslip',
    text: 'common.tabs.order',
    icon: IconOrder
  },
  {
    url: '/profile',
    text: "common.tabs.profile",
    icon: IconProfile
  },
]

/**
 * 判断路由地址是否在tabs列表中
 * @param {string} pathname 路由地址
 */
const isAvailable = (pathname) => tabs.findIndex(({ url }) => url === pathname) !== -1

/**
 * 根据tab是否可见的状态设置body样式
 *
 * @param {boolean} available tab是否可见
 */
const setBodyClass = (available) => {
  const body = window.document.body
  if (available && !body.className.includes('tab-in')) {
    body.className = `${body.className} tab-in`
    return
  }
  if (!available && body.className.includes('tab-in')) {
    body.className = body.className.replace(/\s?tab\-in\s?/ig, ' ')
  }
}

function TabBar ({
  store: {
    app: { lastpath }
  },
  localedRouter
}) {
  const classes = useStyles()

  const [available, setAvailable] = React.useState(false)
  const [tabValue, setTabValue] = React.useState(tabs[0].url)

  React.useEffect(
    () => {
      const pathname  = (lastpath || localedRouter.pathname).replace(/[\?#].*/i, '')
      const isava = isAvailable(pathname)

      setAvailable(isava)
      setBodyClass(isava)
      if (isava) {
        setTabValue(pathname)
      }
    },
    [lastpath]
  )

  return (
    <div
      style={{
        transition: 'height .3s ease-in-out',
        height: available ? 58 : 0
      }}
      id={`lastpath:${lastpath}`}
    >
      <Tabs
        value={tabValue}
        variant="fullWidth"
        textColor="primary"
        classes={{
          root: mergeClass(
            classes.tabs,
            available ? classes.tabsAvailable : null
          ),
          indicator: classes.indicator
        }}
        onChange={(e, value) => localedRouter.replace(value)}
      >
        {
          tabs.map((t, i) => (
            <Tab
              key={i}
              className={classes.item}
              label={ <M id={t.text} /> }
              value={t.url}
              icon={ <t.icon active={t.url === tabValue} /> }
            />
          ))
        }
      </Tabs>
    </div>
  )
}

export default withLocaledRouter(
  observer(TabBar)
)
