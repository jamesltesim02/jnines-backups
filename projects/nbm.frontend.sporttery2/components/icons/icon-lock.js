import LockImage from './images/lock.png'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${LockImage})`,
      marginTop: -1,
      marginRight: 3
    }
  },
  { name: 'IconLock' }
)

export default function IconLock ({
  width = 12,
  height = 15,
  style
}) {
  const classes = useStyles()

  return (
    <Icon
      width={width}
      height={height}
      style={style}
      className={classes.root}
    />
  )
}