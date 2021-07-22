import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { RESOURCE_URL } from '../../../config/config.ops'

import ScoccerImage from './images/soccer.png'
import BasketballImage from './images/bascketball.png'
import EgameImage from './images/egame.png'

const simap = {
  10: ScoccerImage,
  11: BasketballImage,
  99: EgameImage
}

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      width: 50,
      height: 50,
      padding: 5,
      background: '#fff',
      borderRadius: '50%',
      border: 'none',
      boxSizing: 'content-box'
    }
  },
  ['TeamLogo']
)

const TeamLogo = ({
  sid,
  url
}) => {
  const classes = useStyles()

  let src = url ? `${RESOURCE_URL}${url}` : simap[sid]

  return (
    <img
      className={classes.root}
      src={src}
      alt="tlogo"
    />
  )
}

export default TeamLogo
