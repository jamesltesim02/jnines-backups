import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../../config/config.dev'

import M from '../common/m'

import MarketTitle from './market-title'
import SwitchableMatchsHeader from './switchable-matchs-header'
import MatchItem from './match-item'

const useStyles = makeStyles(
  {
    root: {
      marginTop: 6,
      background: '#fff',
      '& .HC-MarketTitle': {
        '& > label': {
          paddingLeft: 10,
          position: 'relative',
          '&::before': {
            content: '""',
            display: 'inline-block',
            position: 'absolute',
            height: 20,
            width: 5,
            top: 0,
            left: 3,
            transform: 'scale(.5)',
            background: '#000'
          }
        },
      }
    },
    11: {
      '& > label::before': {
        background: '#e17e01 !important'
      }
    },
    12: {
      '& > label::before': {
        background: '#c3e045 !important'
      }
    },
    99: {
      '& > label::before': {
        background: '#7f8396 !important'
      }
    }
  },
  { name: 'HomeInplay' }
)

const HomeInplay = ({ list }) => {
  const classes = useStyles()

  const [market, setMarket] = React.useState(listMarkets[0])

  if (!list || !list.length) {
    return null
  }

  let lastSport = null

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
              match.sportId !== lastSport
              ? (
                <MarketTitle
                  title={<M id={`sports.${match.sportId}`} />}
                  sportId={match.sportId}
                  market={market}
                />
              ) : null
            )
            lastSport = match.sportId

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

export default observer(HomeInplay)
