import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { reloadTime } from '../../../config/config.dev'

import mergeClass from '../../../utils/merge-class'
import { withApi } from '../../../api'

import M from '../../common/m'
import SmallFont from '../../common/small-font'

import MarketChooser from './market-chooser'

const useStyles = makeStyles(
  {
    root: {
      height: 40,
    },
    subnav: {
      position: 'fixed',
      width: '100%',
      left: 0,
      zIndex: 2,
      display: 'flex',
      backgroundColor: '#404040',
      // 底部边框
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#585858',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    tabs: {
      marginLeft: -10,
      minHeight: 40,
      flexGrow: 1,
    },
    tab: {
      opacity: 1,
      maxWidth: 'auto',
      minWidth: 'auto',
      minHeight: 40,
      flexGrow: 1,
      padding: '0 5px',
      fontSize: 16
    },
    wrapper: {
      display: 'block',
      '& > span': {
        marginLeft: 3
      }
    },
    indicator: {
      height: 2,
      bottom: 5,
      background: 'transparent',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: '#4acfa5',
        height: 2,
        width: 40,
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    },
    indicatorHide: {
      display: 'none'
    }
  },
  { name: 'Subnav' }
)

const states = [
  // 滚球
  1,
  // 今日
  -1,
  // 早盘
  0,
  // 串关
  99,
]

const cm = {
  1: 'live',
  '-1': 'today',
  0: 'early',
  99: 'combo'
}

const Subnav = ({
  value: { market, state },
  statable = false,
  sportId,
  api: { pull },
  onChange = () => {}
}) => {
  const classes = useStyles()
  const [counts, setCounts] = React.useState({
    liveCount: 0,
    todayCount: 0,
    earlyCount: 0,
    comboCount: 0
  })
  const [reloadTimer, setReloadTimer] = React.useState(null)

  // 查询比赛数量
  const queryCounts = async () => {
    // 清除已设置的定时查询比赛数量任务
    clearTimeout(reloadTimer)
    const counts = await pull.getMatchCount({ sportType: sportId })
    setCounts(counts)

    // 设置指定时间后重新查询比赛数量
    setReloadTimer(setTimeout(queryCounts, reloadTime))
  }

  // 当market发生变化时重新查询比赛数量
  const handleMarketChange = market => {
    if (sportId) {
      queryCounts()
    }
    onChange({ market, state })
  }

  // 如果体育项发生变化则重新查询比赛数量
  React.useEffect(
    () => {
      if (statable) {
        queryCounts()
      }
    },
    [sportId]
  )

  // 清除定时查询任务
  React.useEffect(() => () => { clearTimeout(reloadTimer) },[reloadTimer])

  return (
    <header className={classes.root}>
      <div className={classes.subnav}>
        <MarketChooser
          market={market}
          onChange={handleMarketChange}
        />
        {
          statable ? (
            <Tabs
              value={state}
              variant="scrollable"
              scrollButtons="auto"
              classes={{
                root: classes.tabs,
                indicator: mergeClass(
                  classes.indicator,
                  state === false ? classes.indicatorHide : null
                )
              }}
              onChange={(e, state) => onChange({ market, state })}
            >
              {
                states.map(state => (
                  <Tab
                    key={state}
                    value={state}
                    label={
                      <>
                        <M id={`states.${state}`}  />
                        <SmallFont
                          size={10}
                          origin="left center"
                        >
                          {counts[cm[state]]}
                        </SmallFont>
                      </>
                    }
                    classes={{
                      root: classes.tab,
                      wrapper: classes.wrapper
                    }}
                  />
                ))
              }
            </Tabs>
          ) : null
        }
        
      </div>
    </header>
  )
}

export default withApi('pull')(Subnav)
