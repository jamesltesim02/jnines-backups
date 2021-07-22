import { makeStyles } from '@material-ui/core/styles'
import mergeClass from '../../../utils/merge-class'

import Icon from '../icon'

import AvatarImage0 from './0.png'
import AvatarImage1 from './1.png'
import AvatarImage2 from './2.png'
import AvatarImage3 from './3.png'
import AvatarImage4 from './4.png'
import AvatarImage5 from './5.png'
import AvatarImage6 from './6.png'
import AvatarImage7 from './7.png'
import AvatarImage8 from './8.png'

const useStyles = makeStyles(
  {
    root: {
      borderRadius: '50%',
      overflow: 'hidden',
      backgroundColor: '#fff9ef'
    },
    0: { backgroundImage: `url(${AvatarImage0})` },
    1: { backgroundImage: `url(${AvatarImage1})` },
    2: { backgroundImage: `url(${AvatarImage2})` },
    3: { backgroundImage: `url(${AvatarImage3})` },
    4: { backgroundImage: `url(${AvatarImage4})` },
    5: { backgroundImage: `url(${AvatarImage5})` },
    6: { backgroundImage: `url(${AvatarImage6})` },
    7: { backgroundImage: `url(${AvatarImage7})` },
    8: { backgroundImage: `url(${AvatarImage8})` },
  },
  { name: 'IconAvatar' }
)

export default function IconAvatar ({
  index = 0,
  size = 80,
  style,
  classes = useStyles()
}) {
  return (
    <Icon
      size={size}
      style={style}
      className={mergeClass(classes.root, classes[index])}
    />
  )
}