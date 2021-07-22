import React from 'react'
import { useIntl } from 'react-intl'
import { listMarkets } from '../../config/config.dev'

import MarketTitle from './market-title'
import SwitchableMatchsHeader from './switchable-matchs-header'
import MatchItem from './match-item'

const SoonGroup = ({
  sport,
  matchs
}) => {
  const intl = useIntl()

  const [market, setMarket] = React.useState(listMarkets[0])
  const [unexpands, setUnexpands] = React.useState([])

  const handleToggleExpand = tourId => {
    const index = unexpands.indexOf(tourId)
    if (index === -1) {
      setUnexpands([...unexpands, tourId])
    } else {
      unexpands.splice(index, 1)
      setUnexpands([...unexpands])
    }
  }


  let last = {
    tid: null,
    mid: null
  }


  return (
    <>
      <SwitchableMatchsHeader
        title={intl.formatMessage({ id: `sports.${sport}` })}
        market={market}
        onChange={setMarket}
      />
      {
        matchs.map(match => {
          const isSameTour = last.tid === match.tournamentId
          const expId = (
            isSameTour
            ? `${last.tid}-${last.mid}`
            : `${match.tournamentId}-${match.matchId}`
          )
          const expanded = !unexpands.includes(expId)

          const comp = (
            <React.Fragment key={match.matchId}>
              {
                isSameTour
                ? null
                : (
                  <MarketTitle
                    sportId={match.sportId}
                    tid={match.tournamentId}
                    title={match.tournamentName}
                    market={market}
                    active={false}
                    expandable
                    expanded={expanded}
                    onToggleExpand={() => handleToggleExpand(expId)}
                  />
                )
              }
              {
                expanded
                ? (
                  <MatchItem
                    match={match}
                    market={market}
                  />
                )
                : null
              }
            </React.Fragment>
          )

          if (!isSameTour) {
            last = {
              tid: match.tournamentId,
              mid: match.matchId
            }
          }

          return comp
        })
      }
    </>
  )
}

export default SoonGroup
