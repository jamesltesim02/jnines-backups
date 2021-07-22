import React from 'react'
import BetslipItem from './betslip-item'

function BetslipItemlist ({
  items,
  liveType,
  onPublishGuru
}) {
  return (
    <>
    {
      items.map(item => (
        <BetslipItem
          key={item._id}
          item={item}
          liveType={liveType}
          onPublishGuru={onPublishGuru}
        />
      ))
    }
    </>
  )
}

export default BetslipItemlist
