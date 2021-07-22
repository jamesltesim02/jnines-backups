import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { MATCH_RESOURCE_URL } from '../../config/config.ops'

import mergeClass from '../../utils/merge-class'

import ScoccerImage from '../../public/images/soccer.png'
import BasketballImage from '../../public/images/bascketball.png'

const simap = {
  10: ScoccerImage,
  11: BasketballImage,
}

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      padding: 5,
      background: '#fff',
      //borderRadius: '50%',
      border: 'none',
      boxSizing: 'content-box'
    }
  },
  ['TeamLogo']
)

const TeamLogo = ({
  sid,
  url,
  size = 50,
  className
}) => {
  const classes = useStyles()

  let src = url ? `${MATCH_RESOURCE_URL}${url}` : simap[sid]

  return (
    <img
      src={src}
      className={
        mergeClass(
          classes.root,
          className
        )
      }
      style={{
        width: size,
        height: size
      }}
      alt="tlogo"
    />
  )
}

export default TeamLogo
