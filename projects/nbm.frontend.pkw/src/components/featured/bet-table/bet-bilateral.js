import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import SmallFont from '../../common/small-font'

import MarketName from '../../match/market-name'
import OptionName from '../../match/option-name'

import OptionItem from './option-item'
import BetPane from './bet-pane'

const useStyles = makeStyles(
  {
    odds: {
      color: '#5f94b4',
      width: '100%',
      height: 15,
      lineHeight: '15px',
      justifyContent: 'center',
      flexDirection: 'column',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      paddingLeft: 1,
      backgroundColor: '#1e4064',
      '& > span': {
        display: 'inline-block',
        marginLeft: '-4px'
      }
    }
  },
  { name: 'BetBilateral' }
)

function BetBilateral ({
  matchinfo,
  market
}) {
  const classes = useStyles()

  return (
    <OptionItem
      title={
        <MarketName
          sportId={matchinfo.sportId}
          marketGroup={market.marketGroup}
          marketStage={market.marketStage}
          marketType={market.marketType}
        />
      }
    >
      {
        market.options.map(option => (
          <React.Fragment key={option.optionId}>
            <div className={classes.odds}>
              <SmallFont
                size={8}
                origin="center"
              >
                <OptionName
                  marketType={market.marketType}
                  marketGroup={market.marketGroup}
                  betBar={market.betBar}
                  betOption={option.betOption}
                />
              </SmallFont>
              <SmallFont
                size={8}
                origin="center"
              >@{option.odds}</SmallFont>
            </div>
            <BetPane
              matchinfo={matchinfo}
              market={market}
              option={option}
              oddsOn
            />
          </React.Fragment>
        ))
      }
    </OptionItem>
  )
}

export default observer(BetBilateral)
