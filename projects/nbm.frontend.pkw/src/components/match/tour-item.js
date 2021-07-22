import React from 'react'

import TourTitle from './tour-title'
import MatchItem from './match-item'

const TourItem = ({
  tour,
  editing,
  checked,
  onCheck
}) => {
  const [expand, setExpand] = React.useState(true)

  return (
    <section>
      <TourTitle
        expanded={expand}
        onToggle={expand => setExpand(expand)}
      >
        {tour.name}
      </TourTitle>
      {
        expand ? (
          tour.matchs.map(match => (
            <MatchItem
              key={match.matchId}
              match={match}
              editing={editing}
              checked={checked}
              onCheck={onCheck}
            />
          ))
        ) : null
      }
    </section>
  )
}

export default TourItem
