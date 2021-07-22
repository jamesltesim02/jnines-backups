import { observer } from 'mobx-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { GroupOfMarket, MarketStage } from '../../../../../../consts/match';
import Match from '../../../../../../stores/matchs/Match';

import M from '../../../../../common/m';

function BasketballScore (
  { match }: {
    match: Match
  }
) {
  const intl = useIntl();

  const quaters = [
    MarketStage.H1,
    MarketStage.H2,
  ];

  if (match.gameSession as number > 2) {
    quaters.unshift(
      MarketStage.Q1,
      MarketStage.Q2,
      MarketStage.Q3,
      MarketStage.Q4
    );
  }

  return (
    <ul className="basketball-score">
      {
        quaters.map(period => {
          const score: any = match.getResultScore(
            GroupOfMarket.SCORE,
            period,
            '-:-'
          )?.split(':');

          return (
            <li
              key={period}
              className={`score s-${period}`}
            >
              <label>
                {/* 单独处理 */}
                <M
                  id={`period.${period > 50 ? period - 50 : period + 9}`}
                  values={{
                    type: intl.formatMessage({
                      id: `periods.${match.sportId}`
                    })
                  }}
                />
              </label>
              <div>{score[0]}</div>
              <div>{score[1]}</div>
            </li>
          );
        })
      }
    </ul>
  );
}

export default observer(BasketballScore);
