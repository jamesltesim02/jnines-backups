import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import M from '../common/m'

const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      textAlign: 'center',
      '& > li': {
        width: '100%',
      }
    },
    list1x2: {
      display: 'grid',
      gridTemplateColumns: '2fr 3fr 3fr',
    }
  },
  { name: 'ListOptionName' }
)

const marketNames = {
  '-1': listMarkets.map(({ text }) => text),
  1: ['option.1', 'option.X', 'option.2'],
  186: ['option.1', 'option.2'],
  16: ['option.1', 'option.2'],
  18: ['option.Over', 'option.Under']
}

const ListOptionName = 
inject('store')(
  observer(({
    store: { app },
    sportId,
    market,
    className
  }) => {
    const classes = useStyles()
  
    let marketKey = (
      (
        app.listMarketView === 1
        &&
        market
      ) ? (
        market.type === 1
        ? market.market[sportId === 10 ? 0 : 1]
        : market.market[0]
      ) : '-1'
    )
  
    const names = marketNames[marketKey]
  
    return (
      <ul
        className={
          mergeClass(
            classes.root,
            className,
            app.listMarketView === 2
            ?  classes.list1x2
            : null
          )
        }
      >
        {
          names.map(name => (
            <li key={name}>
              <M id={name} />
            </li>
          ))
        }
      </ul>
    )
  })
)

export default ListOptionName
