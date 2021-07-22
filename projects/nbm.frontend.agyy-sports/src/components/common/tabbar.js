import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import mergeClass from '../../utils/merge-class'

import IconTab from '../icons/icon-tab'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      height: 50
    },
    root: {
      position: 'fixed',
      left: 0,
      zIndex: 5,
      width: '100%',
      bottom: 0,
      background: '#262626',
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200%',
        height: 1,
        background: '#333333',
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
      color: '#828282'
    },
    selected: {
      color: primary.main1
    },
    textColorInherit: {
      opacity: 1,
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
    },
    pc: {
      height: 60,
      '& > $root': {
        position: 'static',
        minHeight: 60,
        background: 'transparent'
      },
      '& $tab': {
        minWidth: 50,
        minHeight: 60,
        color: primary.main1
      },
      '& $tabWrapper': {
        height: 60,
        fontSize: 14
      },
      '& $indicator': {
        display: 'flex',
        backgroundColor: 'transparent',
        height: 2,
        justifyContent: 'center',
        bottom: 4,
        '&::after': {
          content: '""',
          width: 25,
          height: 2,
          background: primary.main1
        }
      }
    }
  }),
  { name: 'Tabbar' }
)

const Tabbar = ({
  pcMode = false
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()
  const location = useLocation()

  const [value, setValue] = React.useState(false)

  const tabs = [
    'home',
    'inPlay',
    'score',
    'live',
  ]
  if (!pcMode) {
    tabs.push('orders')
  }

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

  if (!pcMode && !value) {
    return null
  }


  return (
    <footer
      className={
        mergeClass(
          classes.container,
          pcMode ? classes.pc : null
        )
      }
    >
      <Tabs
        value={value}
        variant="fullWidth"
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
                pcMode
                ? null
                : (
                  <IconTab
                    type={name}
                    active={value === name}
                  />
                )
              }
              classes={{
                root: classes.tab,
                wrapper: classes.tabWrapper,
                labelIcon: classes.labelIcon,
                textColorInherit: classes.textColorInherit,
                selected: classes.selected
              }}
            />
          ))
        }
      </Tabs>
    </footer>
  )
}

export default Tabbar
