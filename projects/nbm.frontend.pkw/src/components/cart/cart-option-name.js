import React from 'react'

import M from '../common/m'

import MarketName from '../match/market-name'
import toOptionName from '../match/to-option-name'

const CartOptionName = ({
  match,
  market,
  option
}) => {
  const on = toOptionName(
    market.marketType,
    market.marketGroup,
    option.betBar,
    option.betOption
  )

  let optionName = null
  if ([1, 16, 186, 14].includes(market.marketType)) {
    optionName = (
      <>
        {
          option.betOption === 'X'
          ? <M id="option.XX" />
          : match.matchName.split(' vs ')[option.betOption - 1]
        }
      </>
    )
  } else {
    optionName = (
      <>
        {on.prefix || ''}
        {
          on.key && (
            <M
              id={`option.${on.key}`}
              values={{
                ...on.params,
                betOption: option.betOption,
                betBar: option.betBar
              }}
            />
          )
        }
        {on.value || ''}
      </>
    )
  }

  return (
    <span>
      <span>
        <MarketName
          sportId={match.sportId}
          marketGroup={market.marketGroup}
          marketStage={market.marketStage}
          marketType={market.marketType}
        />&nbsp;&nbsp;{optionName}
      </span>
      {on.suffix ? <var>{on.suffix || ''}</var> : null}
    </span>
  )
}

export default CartOptionName
