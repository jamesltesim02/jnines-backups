import React from 'react'
import M from './m'

export default function GameName({
  sportId,
  groupType,
  betStage,
  gameType
}) {
  return (
    <M id={`common.game.${sportId}_${groupType}_${betStage}_${gameType}`} />
  )
}
