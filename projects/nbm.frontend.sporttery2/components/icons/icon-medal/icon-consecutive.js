import { makeStyles } from '@material-ui/core/styles'

import getStep from '../../../utils/get-step'

import IconMedalBase from './icon-medal-base'

import ConsecutiveImage3 from './images/consecutive/3.png'
import ConsecutiveImage4 from './images/consecutive/4.png'
import ConsecutiveImage5 from './images/consecutive/5.png'
import ConsecutiveImage6 from './images/consecutive/6.png'
import ConsecutiveImage7 from './images/consecutive/7.png'
import ConsecutiveImage8 from './images/consecutive/8.png'
import ConsecutiveImage9 from './images/consecutive/9.png'
import ConsecutiveImage10 from './images/consecutive/10.png'
import ConsecutiveImage11 from './images/consecutive/11.png'
import ConsecutiveImage12 from './images/consecutive/12.png'

const useStyles = makeStyles(
  {
    3: {
      backgroundImage: `url(${ConsecutiveImage3})`
    },
    4: {
      backgroundImage: `url(${ConsecutiveImage4})`
    },
    5: {
      backgroundImage: `url(${ConsecutiveImage5})`
    },
    6: {
      backgroundImage: `url(${ConsecutiveImage6})`
    },
    7: {
      backgroundImage: `url(${ConsecutiveImage7})`
    },
    8: {
      backgroundImage: `url(${ConsecutiveImage8})`
    },
    9: {
      backgroundImage: `url(${ConsecutiveImage9})`
    },
    10: {
      backgroundImage: `url(${ConsecutiveImage10})`
    },
    11: {
      backgroundImage: `url(${ConsecutiveImage11})`
    },
    12: {
      backgroundImage: `url(${ConsecutiveImage12})`
    },

  },
  { name: 'IconConsecutive' }
)

export const values = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const defaultSize = {
  width: 120,
  height: 80
}

export default function IconConsecutive ({
  size = defaultSize.width,
  value,
  highest = false,
  available
}) {
  const classes = useStyles()
  const height = (defaultSize.height/defaultSize.width) * size

  if (highest) {
    value = getStep(value, values) || values[0]
    available = true
  } else {
    value = value || values[0]
  }

  value = (height ? getStep(value, values) : value) || values[0]

  return (
    <IconMedalBase
      width={size}
      height={height}
      available={available}
      className={classes[value]}
    />
  )
}
