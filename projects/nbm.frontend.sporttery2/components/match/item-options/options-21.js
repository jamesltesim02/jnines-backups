import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import Option from '../option'

const useStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: `repeat(4, 1fr)`,
      gridRowGap: 1,
      background: 'linear-gradient(transparent 30px, #ddd 30px)',
      backgroundSize: '100% 31px'
    },
    option: {
      gridTemplateColumns: '15fr 25fr',
      '& > label': {
        paddingRight: 3
      },
      '& > span': {
        paddingLeft: 3
      }
    }
  },
  { name: 'Options21' }
)


const Options21 = ({
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
          classes={{ root: classes.option }}
        />
      ))
    }
    </div>
  )
}

export default observer(Options21)

