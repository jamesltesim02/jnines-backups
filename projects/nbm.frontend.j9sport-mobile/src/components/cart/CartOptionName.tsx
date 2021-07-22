import React from 'react';

import Market from '../../stores/matchs/Market';
import Match from '../../stores/matchs/Match';

import M from '../common/m';
import { toOptionName } from "../match/OptionName";
import mergeClass from "../../utils/mergeClass";

function CartOptionName(
  {
    option,
    market,
    match,
    className
  }: {
    option: { betOption: any, betBar: string },
    market: Market,
    match: Match,
    className?: string
  }
) {

  const on = toOptionName(
    market.marketType,
    market.marketGroup,
    option.betBar,
    option.betOption
  );

  let optionName = null;
  if ([1, 16, 186, 14, 153, 9059, 9002, 9008, 9052, 9046].includes(market.marketType)) {
    if (String(option.betOption).toLowerCase() === 'home') {
      option.betOption = 1
    }
    if (String(option.betOption).toLowerCase() === 'away') {
      option.betOption = 2
    }
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
                betBar: option.betBar
              }}
            />
          )
        }
        {on.value || ''}
      </>
    );
  }
  return (
    <span className={mergeClass({
      [`${className}`]: !!className
    })}>
      <span>
        {optionName}
      </span>
      {on.suffix ? <var>{on.suffix || ''}</var> : null}
    </span>
  );
}

export default CartOptionName;
