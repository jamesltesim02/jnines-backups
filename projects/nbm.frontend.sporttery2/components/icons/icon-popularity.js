import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import PopularityImage from './images/popularity.png'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${PopularityImage})`
    }
  },
  { name: 'IconPopularity' }
)

export default function IconPopularity ({
  size = 13,
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