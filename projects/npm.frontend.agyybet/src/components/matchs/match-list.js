import React from 'react'
import { observer } from 'mobx-react'
import ScrollableListView from '../common/scrollable-list-view'
import ToTop from '../common/to-top'

import StatedTourHeader from './stated-tour-header'
import MatchItem from './match-item'

const MatchList = ({
  list = [],
  market,
  loading,
  hasMore,
  onNext
}) => {
  const [unexpands, setUnexpands] = React.useState([])

  let last = {
    tid: null,
    mid: null
  }

  const handleToggleExpand = tourId => {
    const index = unexpands.indexOf(tourId)
    if (index === -1) {
      setUnexpands([...unexpands, tourId])
    } else {
      unexpands.splice(index, 1)
      setUnexpands([...unexpands])
    }
  }

  return (
    <>
      <ScrollableListView
        loading={loading}
        hasMore={hasMore}
        checkVersion={unexpands.length}
        onNext={onNext}
      >
        {
          list.map(match => {
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
                    <StatedTourHeader
                      sportId={match.sportId}
                      tid={match.tournamentId}
                      title={match.tournamentName}
                      market={market}
                      active={false}
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
      </ScrollableListView>
      {list.length > 5 ? <ToTop /> : null}
    </>
  )
}

export default observer(MatchList)
