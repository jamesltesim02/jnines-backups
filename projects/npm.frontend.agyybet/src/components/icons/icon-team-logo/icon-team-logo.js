import React from 'react'

import Team1Image from './team1.png'
import Team2Image from './team2.png'

import Cimg from '../../common/cimg'

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
    <Cimg
      src={url ? `competitor/${url}` : logos[type]}
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size
      }}
      alt="tlogo"
    />
  )
}
