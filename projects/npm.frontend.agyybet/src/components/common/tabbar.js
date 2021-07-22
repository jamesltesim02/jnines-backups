import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import IconTab from '../icons/icon-tab'

const useStyles = makeStyles(
  {
    container: {
      height: 50
    },
    root: {
      position: 'fixed',
      left: 0,
      zIndex: 5,
      width: '100%',
      bottom: 0,
      background: '#fff',
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200%',
        height: 1,
        background: '#e5e5e5',
        transformOrigin: 'left top',
        transition: 'scale(.5)'
      }
    },
    indicator: {
      display: 'none'
    },
    tab: {
      padding: 0,
      minHeight: 50,
    },
    tabWrapper: {
      height: 50,
      fontSize: 12,
      lineHeight: '12px'
    },
    labelIcon: {
      '& .MuiTab-wrapper > *:first-child': {
        marginBottom: 3
      }
    }
  },
  { name: 'Tabbar' }
)

const tabs = [
  'home',
  'score',
  'live',
  'orders'
]

const Tabbar = () => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()
  const location = useLocation()

  const [value, setValue] = React.useState(false)

  React.useEffect(
    () => {
      if (location.pathname.indexOf('/tab/') !== 0) {
        return
      }
      const pathname  = location.pathname.split('/')[2] || 'home'
      setValue(
        tabs.findIndex(
          name => name === pathname
        ) > -1 ? pathname : false
      )
    },
    [location]
  )

  if (!value) {
    return null
  }

  return (
    <footer className={classes.container}>
      <Tabs
        value={value}
        variant="fullWidth"
        textColor="primary"
        onChange={(e, value) => history.push(`/tab/${value}`)}
        classes={{
          root: classes.root,
          indicator: classes.indicator,
        }}
      >
        {
          tabs.map(name => (
            <Tab
              key={name}
              label={
                intl.formatMessage({ id: `common.${name}` })
              }
              value={name}
              icon={
                <IconTab
                  type={name}
                  active={value === name}
                />
              }
              classes={{
                root: classes.tab,
                wrapper: classes.tabWrapper,
                labelIcon: classes.labelIcon
              }}
            />
          ))
        }
      </Tabs>
    </footer>
  )
}

export default Tabbar
