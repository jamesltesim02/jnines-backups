import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import Icon from '../icon'

import Chips10Image from './10.png'
import Chips50Image from './50.png'
import Chips100Image from './100.png'
import Chips500Image from './500.png'
import Chips1000Image from './1000.png'
import Chips5000Image from './5000.png'
import Chips10000Image from './10000.png'

const useStyles = makeStyles(
  {
    root: {
      verticalAlign: 'bottom',
      transition: 'all .2s ease-in'
    },
    10: { backgroundImage: `url(${Chips10Image})` },
    50: { backgroundImage: `url(${Chips50Image})` },
    100: { backgroundImage: `url(${Chips100Image})` },
    500: { backgroundImage: `url(${Chips500Image})` },
    1000: { backgroundImage: `url(${Chips1000Image})` },
    5000: { backgroundImage: `url(${Chips5000Image})` },
    10000: { backgroundImage: `url(${Chips10000Image})` }
  },
  { name: 'IconChips' }
)

export default function IconChips ({
  type,
  size = 45,
  className,
  ...props
}) {
  const classes = useStyles()

  return (
    <Icon
      className={
        mergeClass(
          classes.root,
          classes[type],
          className
        )
      }
      width={size}
      height={size * 94 / 90}
      {...props}
    />
  )
}
