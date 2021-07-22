import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const useStyles = makeStyles(
  {
    container: {
      height: 50
    },
    root: {
      backgroundColor: '#404040',
      height: 50,
      position: 'fixed',
      width: '100%',
      zIndex: 1,
    },
    tab: {
      width: '50%'
    },
    indicator: {
      backgroundColor: 'transparent',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: '#4acfa5',
        top: -5,
        left: '50%',
        width: 50,
        height: 2,
        transform: 'translateX(-50%)'
      }
    }
  },
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
      <Tabs
        value={value}
        onChange={(e, value) => onChange(value)}
        classes={{
          root: classes.root,
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
    </div>
  )
}

export default OrderTab
