import React from 'react'
import M from '../common/m'
import BlockHeader from '../common/block-header'

import TourItem from './tour-item'

const TourList = ({
  title,
  titleKey,
  editing,
  checked,
  tours,
  onCheck
}) => {
  if (!tours || !tours.length) {
    return null
  }

  return (
    <section>
      <BlockHeader>{titleKey ? (<M id={titleKey} />) : title}</BlockHeader>
      {
        tours.map(tour => (
          <TourItem
            key={tour.id}
            tour={tour}
            editing={editing}
            checked={checked}
            onCheck={onCheck}
          />
        ))
      }
    </section>
  )
}

export default TourList
