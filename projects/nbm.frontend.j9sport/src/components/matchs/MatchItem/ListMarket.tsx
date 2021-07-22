import { observer } from 'mobx-react';
import React from 'react';

import Market from '../../../stores/matchs/Market';
import Match from '../../../stores/matchs/Match';

import OptionView from '../OptionView';

function ListMarket (
  {
    market,
    match,
    combo = false,
  }: {
    market?: Market,
    match: Match,
    combo?: boolean
  }
) {
  let comps = null;
  if (!market || !market.options.length) {
    comps = (
      <>
        <div className="empty"></div>
        <div className="empty"></div>
        <div className="empty"></div>
      </>
    )
  } else {
    comps = market.options.map(
      option => (
        <div
          key={option.optionId}
          className="option-item"
        >
          <OptionView
            option={option}
            market={market}
            match={match}
            combo={combo}
          />
        </div>
      )
    )
    if (market.options.length < 3) {
      comps.push(<div key="empty" className="empty"></div>)
    }
  }
  return (
    <section className="list-market">
      {comps}
    </section>
  );
}

export default observer(ListMarket);
