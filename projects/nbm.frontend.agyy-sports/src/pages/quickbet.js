import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import withApi from '../api'
import { propagandaVideo } from '../config/config.dev'
import {
  // getMatchUrl,
  getMovieUrl
} from '../utils/resource-url'

import M from '../components/common/m'
// import ButtonArea from '../components/common/button-area'
import VideoBox from '../components/match-detail/media-box/video-box'

import BetCharts from '../components/quickbet/bet-charts'
import MatchInfo from '../components/quickbet/match-info'

import QuickAds from '../components/quickbet/ads'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      height: '100%',
      minHeight: 490,
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gridGap: 26,
      '& > div': {
        borderRadius: 6,
      },
    },
    fcontainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    empty: {
      borderRadius: 6,
      background: '#202026',
      fontSize: 28,
      color: '#555',
    },
    media: {
      '& > .media-video': {
        height: '100%'
      }
    },
    pic: {
      display: 'block',
      height: '100%',
      width: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center top'
    },
    match: {
      position: 'relative',
      background: '#202026',
      display: 'grid',
      gridTemplateRows: '1fr 290px'
    },
  },
  { name: 'QuickbetPreview' }
)
const QuickbetPreview = ({
  api: { pull },
  store: {
    app,
    matchs
  }
}) => {
  const classes = useStyles()

  const [loading, setLoading] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const loadMatch = () => {
    if (loading) {
      return
    }

    setLoading(true)
    pull.getQuickbetMatch().then(
      result => {
        matchs.clear()
        matchs.setData({ normal: result })
      }
    ).finally(
      () => setLoading(false)
    )
  }

  const handleBetSuccess = (result) => {
    if (matchs.normal.list.length === 0) {
      return
    }

    const match = matchs.normal.list.find(({ matchId }) => matchId === result.matchId)
    const key = `${result.marketType}_${result.betOption}`
    match.setBetStatistics({
      ...match.betStatistics,
      [key]: (+result.amount) + match.betStatistics[key]
    })
  }

  // 页面加载或比赛完结自动重新加载
  React.useEffect(
    () => {
      if (!matchs.normal.length) {
        loadMatch()
      }
    },
    [matchs.normal.length]
  )

  let content = null

  if (!matchs.normal.list.length) {
    content = (
      loading ? (
        <div className={classes.fcontainer}>
          <CircularProgress
            size={40}
            color="primary"
          />
        </div>
      ) : (
        <div className={`${classes.fcontainer} ${classes.empty}`}>
          <M id="common.empty1" />
        </div>
      )
    )
  } else {
    const match = matchs.normal.list[index]
    const living = (
      match.liveUrl
      &&
      match.matchState === 1
    )

    content = (
      <section className={classes.root}>
        <div className={classes.media}>
          {
            living ? (
              <VideoBox
                open
                liveUrl={match.liveUrl}
              />
            ) : (
              // <i
              //   className={classes.pic}
              //   style={{ backgroundImage: `url(${getMatchUrl(match.logo)})` }}
              // />
              <VideoBox
                open
                liveUrl={getMovieUrl(propagandaVideo)}
              />
            )
          }
        </div>
        <div className={classes.match}>
          <BetCharts match={match} />
          <MatchInfo
            index={index}
            match={match}
            matchList={matchs.normal.list}
            onMatchIndexChange={setIndex}
            onBetSuccess={handleBetSuccess}
          />
        </div>
      </section>
    )
  }

  return (
    <>
      {content}
      <QuickAds />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(QuickbetPreview)
  )
)
