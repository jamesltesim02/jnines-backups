import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import Options1x2 from './options-1x2'
import Option21 from './options-21'
import OptionsOther from './options-other'
import OptionsS11 from './options-s11'

// const markets = {
//   10: [
//     1,
//     14,
//     21,
//     47,
//     45
//   ],
//   11: [
//     186,
//     16,
//     18,
//     290
//   ]
// }

const optMap = {
  1: Options1x2,
  14: Options1x2,
  21: Option21,
  47: OptionsOther,
  45: OptionsOther,

  186: OptionsS11,
  16: OptionsS11,
  18: OptionsS11,
  290: OptionsOther
}

const useStyles = makeStyles(
  {
    root: {
      border: '1px solid #ddd',
      lineHeight: '30px',
      backgroundColor: '#fff',
      textAlign: 'center'
    },
  },
  { name: 'ItemOptions' }

  )
const ItemOptions = ({
  match,
  market
}) => {
  const classes = useStyles()
  const Options = optMap[market.marketType]

  if (!Options) {
    return null
  }

  return (
    <Options
      market={market}
      match={match}
      className={classes.root}
    />
  )
}

export default observer(ItemOptions)
