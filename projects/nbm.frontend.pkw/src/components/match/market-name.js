import React from 'react'
import M from '../common/m'

export default function MarketName({
  sportId,
  marketGroup,
  marketStage,
  marketType
}) {
  return (
    <M id={`market.${sportId}_${marketGroup}_${marketStage}_${marketType}`} />
  )
}
