import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../../config/config.dev'

import MarketTitle from './market-title'
import SwitchableMatchsHeader from './switchable-matchs-header'
import MatchItem from './match-item'

const useStyles = makeStyles(
  {
    root: {
      background: '#fff',
      marginTop: 6
    }
  },
  { name: 'SportInplay' }
)

const SportInplay = ({ list }) => {
  const classes = useStyles()

  const [market, setMarket] = React.useState(listMarkets[0])
  let lastTour = null

  if (!list.length) {
    return null
  }

  return (
    <div className={classes.root}>
      <SwitchableMatchsHeader
        titleKey="matchs.inplays"
        market={market}
        onChange={setMarket}
      />
      <section>
        {
          list.map(match => {
            const title = (
              match.tournamentId !== lastTour
              ? (
                <MarketTitle
                  title={match.tournamentName}
                  sportId={match.sportId}
                  market={market}
                />
              ) : null
            )
            lastTour = match.tournamentId

            return (
              <React.Fragment key={match.matchId}>
                {title}
                <MatchItem
                  market={market}
                  match={match}
                />
              </React.Fragment>
            )
          })
        }
      </section>
    </div>
  )
}

export default observer(SportInplay)
