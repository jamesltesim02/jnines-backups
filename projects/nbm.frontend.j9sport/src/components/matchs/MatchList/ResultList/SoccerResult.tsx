import React from 'react';
import { GroupOfMarket, MarketStage } from '../../../../consts/match';
import Match from '../../../../stores/matchs/Match';

function Title () {
  return (
    <div className="score-title">
      <label>上半场角球</label>
      <label>上半场比分</label>
      <label>全场角球</label>
      <label>全场比分</label>
    </div>
  );
}

function Item (
  { match }: {
    match: Match
  }
) {
  const scores = [
    // 上半场角球
    {
      group: GroupOfMarket.CORNER,
      stage: MarketStage.H1
    },
    // 上半场比分
    {
      group: GroupOfMarket.SCORE,
      stage: MarketStage.H1
    },
    // 全场角球
    {
      group: GroupOfMarket.CORNER,
      stage: MarketStage.H0
    },
    // 全场比分
    {
      group: GroupOfMarket.SCORE,
      stage: MarketStage.H0
    }
  ]
  return (
    <ul className="score-item">
      {
        scores.map((item, i) => {
          const score = match.getResultScore(item.group, item.stage, '-:-')?.split(':')
          return (
            <li key={i}>
              <span>{score[0]}</span>
              <span>{score[1]}</span>
            </li>
          );
        })
      }
    </ul>
  );
}

export default { Title, Item };
