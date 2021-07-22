import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import BackButton from '../common/back-button'

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
    tabs: {
      minHeight: 45
    },
    tab: {
      width: '50%',
      minHeight: 45
    },
    indicator: {
      backgroundColor: 'transparent',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: primary.main,
        top: -5,
        left: '50%',
        width: 50,
        height: 2,
        transform: 'translateX(-50%)'
      }
    }
  }),
  { name: 'DetailNav' }
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

const OrderTab = ({ value, onChange = () => {}}) => {
  const classes = useStyles()
  const intl = useIntl()

  return (
    <div className={classes.container}>
      <nav className={classes.root}>
        <BackButton />
        <Tabs
          value={value}
          onChange={(e, value) => onChange(value)}
          classes={{
            root: classes.tabs,
            indicator: classes.indicator
          }}
        >
        {
          tabs.map(t => (
            <Tab
              key={t.value}
              value={t.value}
              label={intl.formatMessage({ id: t.labelKey })}
              className={classes.tab}
            />
          ))
        }
        </Tabs>
      </nav>
    </div>
  )
}

export default OrderTab
