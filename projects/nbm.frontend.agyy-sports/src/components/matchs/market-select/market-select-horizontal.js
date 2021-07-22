import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { listMarkets } from '../../../config/config.dev'

import mergeClass from '../../../utils/merge-class'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    tabs: {
      minHeight: 35,
      width: 150,
    },
    tab: {
      padding: 0,
      minHeight: 35,
      minWidth: 50,
      fontSize: 12
    },
    indicator: {
      background: 'rgba(0, 0, 0, 0)',
      bottom: 4,
      '&::before': {
        position: 'absolute',
        content: '""',
        display: 'inline-block',
        background: primary.main1,
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 25,
        height: 2
      }
    },
    pc: {
      width: 210,
      '& $tab': {
        minWidth: 70
      },
      '& $tab.Mui-selected': {
        color: primary.main,
        fontWeight: 600,
      },
      '& $indicator': {
        height: 4,
        bottom: 6,
        '&::before': {
          height: 4,
          width: 10,
          backgroundColor: primary.main,
          borderRadius: 4
        }
      }
    }
  }),
  { name: 'MarketSelectHorizontal' }
)

const MarketSelectHorizontal = ({
  store: { app },
  visible = true,
  sportId,
  market = false, 
  onChange = () => {}
}) => {
  const classes = useStyles()
  const intl = useIntl()

  if (!visible) {
    return null
  }

  return (
    <Tabs
      value={market}
      onChange={(e, value) => onChange(value)}
      classes={{
        root: mergeClass(
          'market-select-horizontal',
          classes.tabs,
          app.pcMode ? classes.pc : null,
        ),
        indicator: classes.indicator
      }}
    >
      {
        listMarkets.map(m => (
          <Tab
            key={m.type}
            value={m}
            label={intl.formatMessage({ id: `${m.text}_${sportId || 10}` })}
            className={classes.tab}
          />
        ))
      }
    </Tabs>
  )
}

export default inject('store')(
  observer(MarketSelectHorizontal)
)
