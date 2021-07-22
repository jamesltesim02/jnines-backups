import { observer } from 'mobx-react';
import React from 'react';
import MarketGroup from '../../../../../stores/matchs/MarketGroup';
import Match from '../../../../../stores/matchs/Match';

import Option from '../../../OptionView';

function Market (
  {
    match,
    marketGroup,
    combo = false,
    fullscreen = false
  }: {
    match: Match,
    marketGroup: MarketGroup,
    combo?: boolean,
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
              className={market.colums ? `columns-${market.colums}` : undefined}
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
                            combo={combo}
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
