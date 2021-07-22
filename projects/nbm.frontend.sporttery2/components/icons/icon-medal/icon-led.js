import { makeStyles } from '@material-ui/core/styles'

import getStep from '../../../utils/get-step'

import IconMedalBase from './icon-medal-base'

import LedImage100 from './images/led/100.png'
import LedImage500 from './images/led/500.png'
import LedImage1000 from './images/led/1000.png'
import LedImage5000 from './images/led/5000.png'
import LedImage10000 from './images/led/10000.png'
import LedImage25000 from './images/led/25000.png'
import LedImage50000 from './images/led/50000.png'
import LedImage75000 from './images/led/75000.png'
import LedImage100000 from './images/led/100000.png'
import LedImage150000 from './images/led/150000.png'

const useStyles = makeStyles(
  {
    100: { backgroundImage: `url(${LedImage100})` },
    500: { backgroundImage: `url(${LedImage500})` },
    1000: { backgroundImage: `url(${LedImage1000})` },
    5000: { backgroundImage: `url(${LedImage5000})` },
    10000: { backgroundImage: `url(${LedImage10000})` },
    25000: { backgroundImage: `url(${LedImage25000})` },
    50000: { backgroundImage: `url(${LedImage50000})` },
    75000: { backgroundImage: `url(${LedImage75000})` },
    100000: { backgroundImage: `url(${LedImage100000})` },
    150000: { backgroundImage: `url(${LedImage150000})` }
  },
  { name: 'IconLed' }
)

export const values = [100, 500, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 150000]

export default function IconLed ({
  size = 122,
  value,
  highest = false,
  available
}) {
  const classes = useStyles()

  if (highest) {
    value = getStep(value, values) || values[0]
    available = true
  } else {
    value = value || values[0]
  }

  return (
    <IconMedalBase
      width={size}
      height={size}
      available={available}
      className={classes[value]}
    />
  )
}
