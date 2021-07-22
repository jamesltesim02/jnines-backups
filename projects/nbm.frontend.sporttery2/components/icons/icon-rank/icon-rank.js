import Consecutive from './consecutive.png'
import Hit from './hit.png'
import Led from './led.png'
import Profit from './profit.png'

import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

const useStyles = makeStyles(
  {
    profit: { backgroundImage: `url(${Profit})` },
    hit: { backgroundImage: `url(${Hit})` },
    consecutive: { backgroundImage: `url(${Consecutive})` },
    led: { backgroundImage: `url(${Led})` },
  },
  { name: 'IconRank' }
)

export default function IconPopularity ({
  type,
  size = 32,
  style
}) {
  const classes = useStyles()
  const className = classes[type]

  return (
    <Icon
      size={size}
      style={style}
      className={className}
    />
  )
}