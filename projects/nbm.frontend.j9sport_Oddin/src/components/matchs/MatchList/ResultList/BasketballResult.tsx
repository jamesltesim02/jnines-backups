import React from 'react';
import { GroupOfMarket, MarketStage } from '../../../../consts/match';
import Match from '../../../../stores/matchs/Match';

import M from '../../../common/m';

function Title () {
  return (
    <div className="score-title">
      {
        [1, 2, 3, 4, 10].map(period => (
          <label key={period}>
            <M
              id={`period.${period}`}
              values={{ type: <M id="periods.11" /> }}
            />
          </label>
        ))
      }
      <label>
        <M id="match.h0" />
      </label>
    </div>
  );
}


function Item (
  { match }: {
    match: Match
  }
) {
  const scores = (
    [
      // 第1节
      MarketStage.Q1,
      // 第2节
      MarketStage.Q2,
      // 第3节
      MarketStage.Q3,
      // 第4节
      MarketStage.Q4,
      // 上半场
      MarketStage.H1,
      // 全场
      MarketStage.H0,
    ].map(
      stage => (
        match.getResultScore(
          GroupOfMarket.SCORE,
          stage,
          '-:-'
        )?.split(':')
      )
    )
  );

  return (
    <ul className="score-item">
      {
        scores.map((score, i) => (
          <li key={i}>
            <span>{score[0]}</span>
            <span>{score[1]}</span>
          </li>
        ))
      }
    </ul>
  );
}

export default { Title, Item };
