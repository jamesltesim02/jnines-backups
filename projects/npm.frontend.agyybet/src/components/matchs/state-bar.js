import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    tabs: {
      minHeight: 45
    },
    tab: {
      minHeight: 45,
      fontSize: 14,
      padding: 0,
      color: '#333',
      '&:not(:first-child)::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: .5,
        top: '50%',
        height: 30,
        width: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'left center',
        transform: 'translateY(-50%) scale(.5)'
      },
    },
    indicator: {
      background: 'rgba(255, 255, 255, 0)',
      height: 2,
      lineHeight: '2px',
      fontSize: 0,
      textAlign: 'center',
      bottom: 9,
      '&::before': {
        content: '""',
        display: 'inline-block',
        width: 30,
        height: 2,
        background: primary.main,
        lineHeight: '2px'
      }
    },
    hideIndicator: {
      opacity: 0
    }
  }),
  { name: 'StateBar' }
)

const states = [
  // 滚球
  {
    type: 1,
    key: 'live'
  },
  // 今日
  {
    type: -1,
    key: 'today'
  },
  // 早盘
  {
    type: 0,
    key: 'early'
  },
  // 串关
  {
    type: 99,
    key: 'combo'
  }
]

const StateBar = ({
  api: { pull },
  sport,
  state = false,
  onChange
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const [counts, setCounts] = React.useState({})

  React.useEffect(
    () => {
      pull.getCountsOfSport(sport).then(setCounts)
    },
    [sport]
  )

  return (
    <Tabs
      value={state}
      variant="fullWidth"
      textColor="primary"
      onChange={(e, value) => onChange(value)}
      classes={{
        root: classes.tabs,
        indicator: mergeClass(
          classes.indicator,
          state === false ? classes.hideIndicator : null
        ),
      }}
    >
      {
        states.map(({ type, key }) => (
          <Tab
            key={type}
          label={`${intl.formatMessage({ id: `matchs.states.${key}`})}(${counts[key] || 0})`}
            value={type}
            classes={{
              root: classes.tab
            }}
          />
        ))
      }
    </Tabs>
  )
}

export default withApi('pull')(StateBar)
