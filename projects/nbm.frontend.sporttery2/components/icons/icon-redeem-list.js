import { makeStyles } from '@material-ui/core/styles'
import Icon from './icon'

import RedeemListImage from './images/redeem-list.png'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${RedeemListImage})`
    }
  },
  { name: 'IconNotes' }
)

export default function IconNotes ({
  size = 13,
  style
}) {
  const classes = useStyles()

  return (
    <Icon
      width={size}
      height={size*(15/13)}
      style={style}
      className={classes.root}
    />
  )
}