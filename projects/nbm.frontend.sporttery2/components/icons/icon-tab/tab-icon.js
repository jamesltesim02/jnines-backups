import { makeStyles } from '@material-ui/core/styles'

import HomeActive from './images/home-active.png'
import Home from './images/home.png'
import OrderActive from './images/order-active.png'
import Order from './images/order.png'
import ProfileActive from './images/profile-active.png'
import Profile from './images/profile.png'
import ScoreActive from './images/score-active.png'
import Score from './images/score.png'

const imageMapping = {
  'home': Home,
  'home-active': HomeActive,
  'order': Order,
  'order-active': OrderActive,
  'profile': Profile,
  'profile-active': ProfileActive,
  'score': Score,
  'score-active': ScoreActive
}

const useStyles = makeStyles(
  {
    root: {
      width: 28,
      height: 28,
      marginBottom: 4
    }
  },
  { name: 'TabIcon' }
)

export default function TabIcon ({ name, active }) {
  const classes = useStyles()
  return (
    <img
      className={classes.root}
      src={imageMapping[`${name}${active ? '-active' : ''}`]}
    />
  )
}
