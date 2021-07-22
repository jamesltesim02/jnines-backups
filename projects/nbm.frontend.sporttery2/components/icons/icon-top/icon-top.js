import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import Top1Image from './top1.png'
import Top2Image from './top2.png'
import Top3Image from './top3.png'

const useStyles = makeStyles(
  {
    text: {
      textAlign: 'center'
    },
    1: { backgroundImage: `url(${Top1Image})` },
    2: { backgroundImage: `url(${Top2Image})` },
    3: { backgroundImage: `url(${Top3Image})` }
  },
  { name: 'IconTop' }
)

export default function IconTop ({
  top = 1,
  classes = useStyles(),
  ...props
}) {
  return (
    top <= 3
    ? (
      <Icon
        width={20}
        height={24}
        className={classes[top]}
        {...props}
      />
) : <span className={classes.text}>{top}</span>
  )
}
