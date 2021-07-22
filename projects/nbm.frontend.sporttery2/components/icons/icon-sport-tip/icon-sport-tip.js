import Soccer from './soccer.png'
import Basketball from './basketball.png'


import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

const useStyles = makeStyles(
  {
    10: { backgroundImage: `url(${Soccer})` },
    11: { backgroundImage: `url(${Basketball})` },
  },
  { name: 'IconSportTip' }
)

export default function IconSportTip ({
  type,
  size = 13,
  style
}) {
  const classes = useStyles()
  const className = classes[type]

  return (
    <Icon
      size={size}
      style={{
        verticalAlign: 'text-top',
        ...style
      }}
      className={className}
    />
  )
}
