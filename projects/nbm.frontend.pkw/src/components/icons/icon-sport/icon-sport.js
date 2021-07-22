import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import Icon from '../icon'

import AllImage from './all.png'
import SoccerImage from './soccer.png'
import BasketballImage from './basketball.png'
import EsportImage from './esport.png'

import AllDarkImage from './all-dark.png'
import SoccerDarkImage from './soccer-dark.png'
import BasketballDarkImage from './basketball-dark.png'
import EsportDarkImage from './esport-dark.png'


const useStyles = makeStyles(
  {
    root: { filter: 'grayscale(100%)' },
    active: { filter: 'grayscale(0%)' },
    all: { backgroundImage: `url(${AllImage})` },
    10: { backgroundImage: `url(${SoccerImage})` },
    11: { backgroundImage: `url(${BasketballImage})` },
    99: { backgroundImage: `url(${EsportImage})` },
    alldark: { backgroundImage: `url(${AllDarkImage})` },
    '10dark': { backgroundImage: `url(${SoccerDarkImage})` },
    '11dark': { backgroundImage: `url(${BasketballDarkImage})` },
    '99dark': { backgroundImage: `url(${EsportDarkImage})` }
  },
  { name: 'IconSport' }
)

export default function IconSport ({
  type,
  size = 20,
  className,
  active = false,
  ...props
}) {
  const classes = useStyles()

  return (
    <Icon
      className={
        mergeClass(
          classes.root,
          classes[`${type}${active ? '' : 'dark'}`],
          className,
          active ? classes.active : null
        )
      }
      size={size}
      {...props}
    />
  )
}
