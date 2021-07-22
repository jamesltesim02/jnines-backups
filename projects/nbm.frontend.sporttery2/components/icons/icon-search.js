import SearchImage from './images/search.png'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${SearchImage})`
    }
  },
  { name: 'IconSearch' }
)

export default function IconSearch ({
  size = 20,
  style
}) {
  const classes = useStyles()

  return (
    <Icon
      size={size}
      style={style}
      className={classes.root}
    />
  )
}