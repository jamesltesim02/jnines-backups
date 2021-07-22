import React from 'react';

import Market from '../../stores/matchs/Market';
import Match from '../../stores/matchs/Match';

import M from '../common/m';
import { toOptionName } from "../match/OptionName";

function CartOptionName(
  {
    option,
    market,
    match
  }: {
    option: { betOption: any },
    market: Market,
    match: Match
  }
) {

  const on = toOptionName(
    market.marketType,
    market.marketGroup,
    market.betBar,
    option.betOption
  );


  let optionName = null;
  if ([1, 16, 186, 14].includes(market.marketType)) {
    optionName = (
      <>
        {
          option.betOption === 'X'
            ? <M id="option.XX"/>
            : match.matchName.split(' vs ')[Number(option.betOption) - 1]
        }
      </>
    );
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
                betBar: market.betBar
              }}
            />
          )
        }
        {on.value || ''}
      </>
    );
  }
  return (
    <span>
      <span>
        {/*<MarketName*/}
        {/*  sportId={match.sportId}*/}
        {/*  marketGroup={market.marketGroup}*/}
        {/*  marketStage={market.marketStage}*/}
        {/*  marketType={market.marketType}*/}
        {/*/>&nbsp;&nbsp;*/}
        {optionName}
      </span>
      {on.suffix ? <var>{on.suffix || ''}</var> : null}
    </span>
  );
}

export default CartOptionName;
