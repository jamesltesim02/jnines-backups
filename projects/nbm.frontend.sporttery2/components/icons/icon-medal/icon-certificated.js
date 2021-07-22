import { makeStyles } from '@material-ui/core/styles'

import IconMedalBase from './icon-medal-base'

import CertificatedImage100000n500 from './images/certificated/100000-500.png'
import CertificatedImage500000n1000 from './images/certificated/500000-1000.png'
import CertificatedImage1000000n5000 from './images/certificated/1000000-5000.png'
import CertificatedImage3000000n10000 from './images/certificated/3000000-10000.png'
import CertificatedImage5000000n25000 from './images/certificated/5000000-25000.png'
import CertificatedImage8000000n35000 from './images/certificated/8000000-35000.png'
import CertificatedImage15000000n50000 from './images/certificated/15000000-50000.png'
import CertificatedImage25000000n75000 from './images/certificated/25000000-75000.png'

const useStyles = makeStyles(
  {
    '100000-500': {
      backgroundImage: `url(${CertificatedImage100000n500})`
    },
    '500000-1000': {
      backgroundImage: `url(${CertificatedImage500000n1000})`
    },
    '1000000-5000': {
      backgroundImage: `url(${CertificatedImage1000000n5000})`
    },
    '3000000-10000': {
      backgroundImage: `url(${CertificatedImage3000000n10000})`
    },
    '5000000-25000': {
      backgroundImage: `url(${CertificatedImage5000000n25000})`
    },
    '8000000-35000': {
      backgroundImage: `url(${CertificatedImage8000000n35000})`
    },
    '15000000-50000': {
      backgroundImage: `url(${CertificatedImage15000000n50000})`
    },
    '25000000-75000': {
      backgroundImage: `url(${CertificatedImage25000000n75000})`
    },
  },
  { name: 'IconCertified' }
)


const defaultSize = {
  width: 125,
  height: 101
}

export const values = [
  [100000, 500],
  [500000, 1000],
  [1000000, 5000],
  [3000000, 10000],
  [5000000, 25000],
  [8000000, 35000],
  [15000000, 50000],
  [25000000, 75000],
]

export default function IconProfit ({
  size = defaultSize.width,
  value,
  highest = false,
  available
}) {
  const classes = useStyles()
  const height = (defaultSize.height/defaultSize.width) * size

  if (highest) {
    value = values.find(vstep => {
      return value[0] > vstep[0] && value[1] > vstep[1]
    }) || values[0]
    available = true
  } else {
    value = value || values[0]
  }

  return (
    <IconMedalBase
      width={size}
      height={height}
      available={available}
      className={classes[`${value[0]}-${value[1]}`]}
    />
  )
}
