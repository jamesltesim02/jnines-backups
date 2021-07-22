import { observer } from 'mobx-react';
import React from 'react';
import MarketGroup from '../../../../stores/matchs/MarketGroup';
import Match from '../../../../stores/matchs/Match';

import Option from '../../../match/OptionView';

function Market (
  {
    match,
    marketGroup,
    fullscreen = false
  }: {
    match: Match,
    marketGroup: MarketGroup,
    fullscreen? : boolean
  }
) {
  return (
    <ul className="detail-market">
      {
        marketGroup.markets.map(
          market => (
            <li 
              key={market.marketId}
              className={`columns-${market.colums || market.options.length}`}
            >
              {
                market.sortedOptions.map(
                  (o, i) => (
                    <div key={i}>
                      {
                        o ? (
                          <Option
                            option={o}
                            market={market}
                            match={match}
                            fullscreen={fullscreen}
                          />
                        ) : (null)
                      }
                    </div>
                  )
                )
              }
            </li>
          )
        )
      }
    </ul>
  );
}

export default observer(Market);
