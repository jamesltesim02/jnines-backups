import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import Icon from './icon'

import SelectedImage from './images/selected.png'

const useStyles = makeStyles(
  ({ palette: { primary }}) => ({
    root: {
      backgroundColor: primary.main,
      borderRadius: '50%',
      backgroundImage: `url(${SelectedImage})`
    }
  }),
  { name: 'IconSelected' }
)

export default function IconSelected ({
  size = 22,
  style,
  className
}) {
  const classes = useStyles()
  return (
    <Icon
      size={size}
      style={style}
      className={mergeClass(classes.root, className)}
    />
  )
}