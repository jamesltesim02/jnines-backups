import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import Option from '../option'

const useStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: `repeat(2, 1fr)`,
      '& > button:not(:first-child)::before': {
        content: '""',
        display: 'inline-block',
        width: 0,
        height: 'calc(100% - 12px)',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        borderLeft: '1px dotted #ccc'
      }
    }
  },
  { name: 'Options1x2' }
)

const labels = {
  186: ['客胜', '主胜'],
  16: ['客胜', '主胜'],
  18: ['大分', '小分']
}

const Options1618 = ({
  market,
  match,
  className
}) => {
  const classes = useStyles()

  const hoption = market.options.find(o => ['1', 'Home', 'Over'].includes(o.betOption))
  const aoption = market.options.find(o => ['2', 'Away', 'Under'].includes(o.betOption))

  return (
    <div
      className={
        mergeClass(
          classes.root,
          className
        )
      }
    >
      <Option
        key={aoption.optionId}
        option={aoption}
        market={market}
        match={match}
        label={labels[market.marketType][0]}
      />
      <Option
        key={hoption.optionId}
        option={hoption}
        market={market}
        match={match}
        label={labels[market.marketType][1]}
      />
    </div>
  )
}

export default observer(Options1618)
