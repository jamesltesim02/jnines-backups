import React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    container: {
      height: 50
    },
    root: {
      backgroundColor: '#404040',
      height: 50,
      width: '100%',
      zIndex: 3,
    },
    fixed: {
      position: 'fixed',
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
        width: '60%',
        height: 2,
        transform: 'translateX(-50%)'
      }
    }
  },
  { name: 'TabMenu' }
)

const TabMenu = ({
  value,
  tabs = [],
  fixed = false,
  onChange = () => {}
}) => {
  const classes = useStyles()
  const intl = useIntl()

  return (
    <div className={classes.container}>
      <Tabs
        value={value}
        variant="scrollable"
        scrollButtons="auto"
        // centered
        onChange={(e, value) => onChange(value)}
        classes={{
          root: mergeClass(
            classes.root,
            fixed ? classes.fixed : null
          ),
          flexContainer: classes.flexContainer,
          indicator: classes.indicator
        }}
      >
      {
        tabs.map(
          ({
            value,
            label,
            labelKey
          }) => (
            <Tab
              key={value}
              value={value}
              label={
                labelKey
                ? (intl.formatMessage({ id: labelKey }))
                : label
              }
            />
          )
        )
      }
      </Tabs>
    </div>
  )
}

export default observer(TabMenu)
