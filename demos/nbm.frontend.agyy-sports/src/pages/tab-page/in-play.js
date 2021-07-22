import React,{ useState,useEffect } from 'react'
import { useIntl } from "react-intl";
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import withApi from "../../api"
import { listMarkets } from "../../config/config.dev"
import { availableSports } from '../../config/config.dev'

import HomeNav from '../../components/matchs/home-nav'
import EmptyRecords from "../../components/common/empty-records"
import StatedPage from "./home/sport-page/stated"
import M from "../../components/common/m"
import BackButton from "../../components/common/back-button"

import Cart from '../../components/cart'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    navBar: {
      position: 'sticky',
      paddingTop: 30,
      top:120,
      zIndex: 5,
      backgroundColor: '#eee',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 4,
        width: '200%',
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
    },
    tabs: {
      minHeight: 45,
    },
    tab: {
      minHeight: 45,
      fontSize: 14,
      padding: 0,
      color: '#333',
      minWidth: 80,
      marginRight: 40,
    },
    indicator: {
      background: 'rgba(255, 255, 255, 0)',
      height: 2,
      lineHeight: '2px',
      fontSize: 0,
      textAlign: 'center',
      bottom: 0,
      '&::before': {
        content: '""',
        display: 'inline-block',
        width: 40,
        height: 2,
        background: primary.main,
        lineHeight: '2px'
      }
    },
    backBtn: {
      backgroundColor: '#f2f2f2',
      '&>button': {
        padding: '0 10px',
        height: 30,
        fontSize: 12,
        textShadow: 'none',
        '& > i': {
          marginTop: 1
        }
      }
    },
}))

const InPlayPage = ({
  store: { app },
  api: { pull }
}) => {
  const history = useHistory()
  const classes = useStyles()
  const intl = useIntl()

  const [loading, setLoading] = useState(false)
  const [counts, setCounts] = useState({})
  const [sportId, setSportId] = useState(false)
  const [market] = React.useState(listMarkets[0])
  const initCount = Object.keys(counts)[0] ? Number(Object.keys(counts)[0]) : 10

  const handleSportChange = sport => history.replace(`/tab/home/${sport}/`)

  const handleInPlayChange = sport => setSportId(sport)

  const handleTabsChange = (e,sport) => setSportId(sport)

  useEffect(() => {
    setLoading(false)

    pull.getAppLiveMatchCount().then(res =>{
      setCounts(
        Object.fromEntries(
          res.filter(
            ({ sportId }) => sportId !== -1
          ).map(item => [item.sportId, item.count])
        )
      )
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      <div className={classes.root}>
        {
          app.pcMode ?
            (<>
              {/*pc*/}
              <HomeNav
                  fixed
                  sport={false}
                  onChange={handleSportChange}
                />
                <header className={classes.navBar}>
                  <Tabs
                    value={sportId || initCount}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    onChange={handleTabsChange}
                    classes={{
                      root: classes.tabs,
                      indicator: classes.indicator
                    }}
                  >
                    {
                      availableSports.map(key => {
                        return (
                          <Tab
                            key={ key }
                            label={`${intl.formatMessage({ id: `sports.${key}`})}(${counts[key] || 0})`}
                            classes={{root: classes.tab}}
                            value={ key }
                          />
                        )
                      })
                    }
                  </Tabs>
                </header>
              </>)
            :
            (<>
              {/*移动端*/}
                <HomeNav
                  fixed
                  minify
                  inPlayCounts={counts}
                  sport={sportId || initCount}
                  onChange={handleInPlayChange}
                />
                <div className={classes.backBtn}>
                  <BackButton
                    arrowProperties={{
                      size: 12,
                      weight: 1
                    }}
                  >
                    <M id="common.back" />
                  </BackButton>
                </div>
              </>)
        }

        {
          Object.keys(counts).length !== 0 || loading
            ?
          (
            <section>
              <div className={classes.content}>
                <StatedPage
                  key={1}
                  sportId={sportId || initCount}
                  matchState={1}
                  market={market}
                />
              </div>
            </section>
          )
            :
            <EmptyRecords/>
        }
      </div>
      <Cart intabs />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(InPlayPage)
  )
)