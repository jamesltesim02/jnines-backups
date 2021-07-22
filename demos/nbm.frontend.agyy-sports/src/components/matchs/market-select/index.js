import React from 'react'

import MarketSelectVertival from './market-select-vertical'
import MarketSelectHorizontal from './market-select-horizontal'

const MarketSelect = ({
  vertical = false,
  ...props
}) => {
  const MarketSelect = vertical ? MarketSelectVertival : MarketSelectHorizontal
  return (
    <MarketSelect {...props} />
  )
}

export default MarketSelect
