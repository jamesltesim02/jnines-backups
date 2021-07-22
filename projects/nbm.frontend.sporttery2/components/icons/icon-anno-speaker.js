import Icon from './icon'
import { makeStyles } from '@material-ui/core/styles'

import SpeakerImage from './images/speaker.png'

const useStyles = makeStyles(
  {
    root: {
      verticalAlign: 'sub',
      backgroundImage: `url(${SpeakerImage})`
    },
  },
  { name: 'IconAnnoSpeaker' }
)

export default function IconAnnoSpeaker ({
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
