import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import OptionName from '../../match/option-name'

import OptionItem from './option-item'
import BetBilateral from './bet-bilateral'
import BetPane from './bet-pane'

const useStyles = makeStyles(
  {
    root: {
      padding: '0 10px 5px'
    },
    opt3sides: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridColumnGap: 10,
      marginBottom: 10,
      '&:last-child': {
        marginBottom: 0
      }
    }
  },
  { name: 'BetTable' }
)

function BetTable ({
  store: {
    featured: { matchinfo }
  }
}) {
  const classes = useStyles()

  const market1 = matchinfo.markets.get(1)
  const market16 = matchinfo.markets.get(16)
  const market18 = matchinfo.markets.get(18)
  const market26 = matchinfo.markets.get(26)
  return (
    <section className={classes.root}>
      <div className={classes.opt3sides}>
        {
          // 玩法: 胜平负
          (market1 && market1.options)
          ? (
            market1.options.map(option => (
              <OptionItem
                key={option.optionId}
                title={
                  <>
                    <OptionName
                      marketType={market1.marketType}
                      marketGroup={market1.marketGroup}
                      betBar={market1.betBar}
                      betOption={option.betOption}
                    /> @{option.odds}
                  </>
                }
              >
                <BetPane
                  matchinfo={matchinfo}
                  market={market1}
                  option={option}
                />
              </OptionItem>
            ))
          ) : null
        }
      </div>
      <div className={classes.opt3sides}>
        {
          [market16, market18, market26].map(market => (
            market ? (
              <BetBilateral
                key={market.marketId}
                matchinfo={matchinfo}
                market={market}
              />
            ) : null
          ))
        }
      </div>
    </section>
  )
}

export default inject('store')(
  observer(BetTable)
)
