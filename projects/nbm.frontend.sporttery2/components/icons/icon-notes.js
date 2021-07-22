import NotesImage from './images/notes.png'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

const useStyles = makeStyles(
  {
    root: {
      backgroundImage: `url(${NotesImage})`
    }
  },
  { name: 'IconNotes' }
)

export default function IconNotes ({
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