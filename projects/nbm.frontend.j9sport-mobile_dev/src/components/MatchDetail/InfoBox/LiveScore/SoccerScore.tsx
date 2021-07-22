import React from 'react';
import { GroupOfMarket, MarketStage } from '../../../../consts/match';
import Match from '../../../../stores/matchs/Match';
import IconSoccerScore from '../../../icons/IconSoccerScore';

function SoccerScore (
  { match }: {
    match: Match
  }
) {

  const scores = [
    // 黄牌
    {
      key: 'yellowCard',
      score: match.matchStatistic?.yellowCard
    },
    // 红牌
    {
      key: 'redCard',
      score: match.matchStatistic?.redCard
    },
  ];

  if (match.matchStatistic?.corners) {
    // 角球
    scores.unshift({
      key: 'corner',
      score: match.matchStatistic?.corners
    })
  }

   // 如果当前为下半场,则获取上半场比分
  if (match.matchPeriod === MarketStage.PERIOD_H2) {
    scores.unshift({
      key: 'h1',
      score: (
        match.getResultScore(
          GroupOfMarket.SCORE,
          MarketStage.H1,
          '0:0'
        )
      )
    });
  }

  return (
    <ul className="soccer-score">
      {
        scores.map(item => (
          <li key={item.key}>
            <span>{item.score || '0:0'}</span>
            <IconSoccerScore type={item.key} />
          </li>
        ))
      }
    </ul>
  );
}

export default SoccerScore;
