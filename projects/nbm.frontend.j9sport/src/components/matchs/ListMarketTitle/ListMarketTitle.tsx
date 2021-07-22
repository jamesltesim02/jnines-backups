import React from 'react';

import {
  SportType,
  LIST_MARKETS
} from '../../../consts/match';

import M from '../../common/m';
import MarketName from '../MarketName';

function ListMarketTitle (
  {
    sportId,
    beforeLabels,
  }: {
    sportId: SportType,
    beforeLabels?: any,
  }
) {
  return (
    <section className="list-market-title">
      <div className="befores">
        {beforeLabels}
      </div>
      <div className="markets">
      {
        LIST_MARKETS[sportId].map(
          (market: any, i: number) => (
            <label key={i}>
              {
                market ? (
                  <MarketName
                    sportId={sportId}
                    marketStage={market.marketStage}
                    marketType={market.marketType}
                    marketGroup={1}
                  />
                ) : null
              }
            </label>
          )
        )
      }
      </div>
      <div className="more">
        <label><M id="match.more" /></label>
      </div>
    </section>
  );
}

export default ListMarketTitle;
