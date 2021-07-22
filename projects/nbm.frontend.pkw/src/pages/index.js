import React from 'react'
import { inject, observer} from 'mobx-react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import { availableSports } from '../config/config.dev'

import { withApi } from '../api'

import M from '../components/common/m'
import LineHolder from '../components/common/line-holder'
import Subnav from '../components/common/subnav'

import TourList from '../components/match/tour-list'

const useStyles = makeStyles(
  {
    inplay: {
      lineHeight: '35px',
      paddingLeft: 10,
      fontWeight: 500,
      backgroundColor: '#585858'
    }
  },
  { name: 'IndexPage' }
)

const Home = ({
  store: {
    match,
    toast
  },
  api: { pull } 
}) => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const homeStore = match.all

  const [market, setMarket] = React.useState(+(new URLSearchParams(location.search).get('market') || 16))
  React.useEffect(() => {
    setMarket(+(new URLSearchParams(location.search).get('market') || 16))
  }, [location])

  React.useEffect(() => {
    toast.loading()
    homeStore.clearTimer()

    match.setCurrent('all')
    match.setCurrentData({ matchs: [] })
    match.setCurrentMarket(market)

    pull.getHotMatch({
      marketTypes: [market]
    }).then(initData => {
      match.setCurrentData(initData)
      homeStore.setTimer()
    }).finally(() => {
      toast.loading(false)
    })

    return () => homeStore.clearTimer()
  }, [market, homeStore.reloadVersion])


  React.useEffect(() => {
    return () => {
      match.setCurrentData({ matchs: [] })
      match.setCurrent(null)
      homeStore.clearTimer()
    }
  }, [])

  if (!match.all) {
    return null
  }

  return (
    <>
      <Subnav
        value={{ market }}
        onChange={({ market }) => {
          history.replace(`/matchs/all?market=${market}`)
        }}
      />
      {
        match.all.hot.length > 0
        ? (
          <TourList
            titleKey="page.hots"
            tours={match.all.hot}
          />
        ) : null
      }
      {
        match.all.live.size > 0
        ? (
          <>
            <LineHolder />
            <header className={classes.inplay}>
              <M id="page.inplay" />
            </header>
            {
              availableSports.map(sid => {
                const tours = match.all.live.get(sid)
                return (
                  <TourList
                    key={sid}
                    titleKey={`sports.${sid}`}
                    tours={tours}
                  />
                )
              })
            }
          </>
        ) : null
      }
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(Home)
  )
)
