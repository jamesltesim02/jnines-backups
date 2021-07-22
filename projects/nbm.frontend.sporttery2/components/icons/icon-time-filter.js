import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import TimeFilterImage from './images/time-filter.png'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${TimeFilterImage})`
    }
  },
  { name: 'IconTimeFilter' }
)

export default function IconTimeFilter ({
  size = 20,
  style,
  classes = useStyles()
}) {
  return (
    <Icon
      size={size}
      style={style}
      className={classes.root}
    />
  )
}