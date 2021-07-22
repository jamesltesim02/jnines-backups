import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import BackButton from '../common/back-button'
import TabMenu from '../common/tab-menu'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      height: 45
    },
    root: {
      backgroundColor: '#fff',
      height: 45,
      position: 'fixed',
      width: '100%',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '45px 1fr',
      alignItems: 'center',
      '& > button::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        right: 0,
        top: 0,
        height: '200%',
        width: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'right top',
        transform: 'scale(.5)'
      }
    },
    tabContainer: {
      height: 45
    },
    tabs: {
      minHeight: 45
    },
    tab: {
      width: '50%',
      minHeight: 45,
      maxWidth: 160
    },
    indicator: {
      backgroundColor: 'transparent',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: primary.main,
        top: 4,
        left: '50%',
        width: 50,
        height: 2,
        transform: 'translateX(-50%)'
      }
    },
    pc: {
      '& $root': {
        width: 'calc(100% - 260px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: -130,
          width: '100vw',
          height: 45,
          background: '#fff'
        },
        '& > button': {
          transform: 'translateX(-15px)'
        },
        '& > button::after': {
          display: 'none'
        }
      }
    }
  }),
  { name: 'OrderTab' }
)

const tabs = [
  {
    value: 0,
    labelKey: 'order.unsettle'
  },
  {
    value: 1,
    labelKey: 'order.settled'
  }
]

const OrderTab = ({
  store: { app },
  value,
  onChange = () => {}
}) => {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.container,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <nav className={classes.root}>
        <BackButton />
        <TabMenu
          value={value}
          menus={tabs}
          classes={{
            root: classes.tabContainer,
            tabs: classes.tabs,
            tab: classes.tab,
            indicator: classes.indicator
          }}
          tabProps={{
            centered: true
          }}
          onChange={value => onChange(value)}
        />
      </nav>
    </div>
  )
}

export default inject('store')(
  observer(OrderTab)
)
