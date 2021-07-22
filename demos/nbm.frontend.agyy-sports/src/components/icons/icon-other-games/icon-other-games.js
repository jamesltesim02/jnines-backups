import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import IconGame1Image from './game1.jpg'
import IconGame2Image from './game2.jpg'
import IconGame3Image from './game3.jpg'


const useStyles = makeStyles(
  {
    1: { backgroundImage: `url(${IconGame1Image})` },
    2: { backgroundImage: `url(${IconGame2Image})` },
    3: { backgroundImage: `url(${IconGame3Image})` },
  },
  { name: 'IconTab' }
)

export default function IconTab ({
  type = 1,
}) {
  const classes = useStyles()

  return (
    <Icon
      width={60}
      height={38}
      className={classes[type]}
    />
  )
}
