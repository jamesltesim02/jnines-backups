import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import Option from '../option'

const useStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: `repeat(3, 1fr)`,
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
  '1': '主胜',
  x: '平',
  X: '平',
  '2': '客胜'
}

const Options1x2 = ({
  market,
  match,
  className
}) => {
  const classes = useStyles()

  const options = market.options.slice().sort(
    (o1, o2) => o1.orderNo - o2.orderNo
  )

  return (
    <div
      className={
        mergeClass(
          classes.root,
          className
        )
      }
    >
      {
        options.map(o => (
          <Option
            key={o.optionId}
            option={o}
            market={market}
            match={match}
            label={labels[o.betOption]}
          />
        ))
      }
    </div>
  )
}

export default observer(Options1x2)
