import { makeStyles } from '@material-ui/core/styles'

import getStep from '../../../utils/get-step'

import IconMedalBase from './icon-medal-base'

import ProfitImage30000 from './images/profit/30000.png'
import ProfitImage100000 from './images/profit/100000.png'
import ProfitImage500000 from './images/profit/500000.png'
import ProfitImage1000000 from './images/profit/1000000.png'
import ProfitImage3000000 from './images/profit/3000000.png'
import ProfitImage8000000 from './images/profit/8000000.png'
import ProfitImage15000000 from './images/profit/15000000.png'
import ProfitImage25000000 from './images/profit/25000000.png'
import ProfitImage50000000 from './images/profit/50000000.png'
import ProfitImage100000000 from './images/profit/100000000.png'

const useStyles = makeStyles(
  {
    30000: {
      backgroundImage: `url(${ProfitImage30000})`
    },
    100000: {
      backgroundImage: `url(${ProfitImage100000})`
    },
    500000: {
      backgroundImage: `url(${ProfitImage500000})`
    },
    1000000: {
      backgroundImage: `url(${ProfitImage1000000})`
    },
    3000000: {
      backgroundImage: `url(${ProfitImage3000000})`
    },
    8000000: {
      backgroundImage: `url(${ProfitImage8000000})`
    },
    15000000: {
      backgroundImage: `url(${ProfitImage15000000})`
    },
    25000000: {
      backgroundImage: `url(${ProfitImage25000000})`
    },
    50000000: {
      backgroundImage: `url(${ProfitImage50000000})`
    },
    100000000: {
      backgroundImage: `url(${ProfitImage100000000})`
    },
  },
  { name: 'IconProfit' }
)

export const values = [30000, 100000, 500000, 1000000, 3000000, 8000000, 15000000, 25000000, 50000000, 100000000]

const defaultSize = {
  width: 120,
  height: 87
}

export default function IconProfit ({
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

  return (
    <IconMedalBase
      width={size}
      height={height}
      available={available}
      className={classes[value]}
    />
  )
}
