import React from 'react'
import M from '../common/m'

export default function GameName({
  sportId,
  groupType,
  betStage,
  gameType,
  marketParam,
}) {
  return (
    <M
      id={`market.${sportId}.${groupType}_${betStage}_${gameType}`}
      values={{ y: marketParam }}
    />
  )
}
