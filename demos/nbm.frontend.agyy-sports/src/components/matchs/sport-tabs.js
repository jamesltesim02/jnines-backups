import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { availableSports } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import { loadFromStorage, saveToStorage } from '../../utils/storage-utils'

import IconSports from '../icons/icon-sports'

const SPORT_PRIORITY_CACHE = 'agyybet-sport-priority-cache'

const useStyles = makeStyles(
  {
    tabs: {
      width: '100%',
    },
    indicator: {
      display: 'none'
    },
    tab: {
      minWidth: 75,
      minHeight: 55,
      padding: 0,
      // 按钮右边边框
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        right: 0,
        top: 0,
        width: 1,
        height: '200%',
        backgroundColor: '#ddd',
        transformOrigin: 'center top',
        transform: 'scale(.5)'
      }
    },
    tabWrapper: {
      height: 55,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      lineHeight: '12px',
      padding: '0 5px'
    },
    labelIcon: {
      '& .MuiTab-wrapper > *:first-child': {
        marginBottom: 4
      }
    },
    pc: {
      marginTop: 10,
      maxHeight: 'calc(100vh - 161px)',
      '& $tab': {
        padding: '10px 0',
        '&::after': {
          display: 'none'
        }
      },
    }
  },
  { name: 'SportTabs' }
)

const SportTabs = ({
  pcMode = false,
  sport = false,
  counts = {},
  onChange = () => {},
  countable = true
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const sportList = [...availableSports]

  // 本地体育类型排序权重值
  let sportOrders = loadFromStorage(SPORT_PRIORITY_CACHE, null)
  if (sportOrders) {
    sportList.sort((s1, s2) => (sportOrders[s2] || 0) - (sportOrders[s1] || 0))
  }

  return (
    <Tabs
      value={sport}
      orientation={pcMode ? 'vertical' : 'horizontal'}
      variant="scrollable"
      scrollButtons="auto"
      onChange={(e, value) => {
        if (!sportOrders) {
          sportOrders = {}
        }

        sportOrders[value] = (sportOrders[value] || 0) + 1
        saveToStorage(SPORT_PRIORITY_CACHE, sportOrders)
        onChange(value)
      }}
      classes={{
        root: mergeClass(
          classes.tabs,
          pcMode ? classes.pc : null
        ),
        flexContainer: classes.flexContainer,
        indicator: classes.indicator
      }}
    >
      {
        sportList.map(type => (
          <Tab
            key={type}
            value={type}
            label={
              `${
                intl.formatMessage({ id: `sports.${type}` })
              }${
                countable ? ` (${counts[type] || 0})` : ''
              }`
            }
            icon={
              <IconSports
                type={type}
                active={sport === type}
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
  )
}

export default SportTabs
