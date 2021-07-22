import Icon from './icon'
import { makeStyles } from '@material-ui/core/styles'

import MessageImage from './images/message.png'

const useStyles = makeStyles(
  {
    root: {
      verticalAlign: 'sub',
      backgroundImage: `url(${MessageImage})`
    },
  },
  { name: 'IconMessage' }
)

export default function IconMessage ({
  size = 28,
  style
}) {
  const { root } = useStyles()

  return (
    <Icon
      size={size}
      style={style}
      className={root}
    />
  )
}
