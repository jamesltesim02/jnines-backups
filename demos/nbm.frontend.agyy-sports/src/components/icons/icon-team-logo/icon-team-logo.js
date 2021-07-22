import React from 'react'

import { getTeamLogoUrl } from '../../../utils/resource-url'

import Team1Image from './team1.png'
import Team2Image from './team2.png'

const logos = {
  1: Team1Image,
  2: Team2Image
}

export default function IconTeamLogo ({
  type = 1,
  size = 40,
  className,
  url = null
}) {
  return (
    <img
      src={url ? getTeamLogoUrl(url) : logos[type]}
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size
      }}
      alt=""
    />
  )
}
