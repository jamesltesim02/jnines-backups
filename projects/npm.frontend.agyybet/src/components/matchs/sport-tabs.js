import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { availableSports } from '../../config/config.dev'

import { loadFromStorage, saveToStorage } from '../../utils/storage-utils'

import IconSports from '../icons/icon-sports'

const SPORT_ORDER_CACHE = 'agyybet-sport-order-cache'

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
  },
  { name: 'SportTabs' }
)

const SportTabs = ({
  sport = false,
  counts = {},
  onChange = () => {},
  minify = false,
  countable = true
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const sportList = [...availableSports]

  // 本地体育类型排序权重值
  let sportOrders = loadFromStorage(SPORT_ORDER_CACHE, null)
  if (sportOrders) {
    sportList.sort((s1, s2) => (sportOrders[s2] || 0) - (sportOrders[s1] || 0))
  }

  // 如果是首页则添加红彩链接入口
  // if (!minify) {
    // sportList.splice(2, 0, 901)
  // }

  return (
    <Tabs
      value={sport}
      variant="scrollable"
      scrollButtons="auto"
      onChange={(e, value) => {
        if (!sportOrders) {
          sportOrders = {}
        }

        sportOrders[value] = (sportOrders[value] || 0) + 1
        saveToStorage(SPORT_ORDER_CACHE, sportOrders)
        onChange(value)
      }}
      classes={{
        root: classes.tabs,
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
              }${countable ? ` (${counts[type] || 0})` : ''}`
              // }${(type !== 901 && countable) ? ` (${counts[type] || 0})` : ''}`
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
