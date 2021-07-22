import React from 'react';
import { GroupOfMarket, MarketStage } from '../../../../consts/match';
import Match from '../../../../stores/matchs/Match';

function BasketballResult (
  { match }: {
    match: Match
  }
) {

  return (
    <ul className="basketball-result">
      {
        [
          // 第1节
          {
            stage: MarketStage.Q1,
            title: (<label>Q1</label>)
          },
          // 第2节
          {
            stage: MarketStage.Q2,
            title: (<label>Q2</label>)
          },
          // 第3节
          {
            stage: MarketStage.Q3,
            title: (<label>Q3</label>)
          },
          // 第4节
          {
            stage: MarketStage.Q4,
            title: (<label>Q4</label>)
          },
          // 上半场
          {
            stage: MarketStage.H1,
            title: (<label>H1</label>)
          },
          // 全场
          {
            stage: MarketStage.H0,
            title: (<label>FT</label>)
          },
        ].map((item, i) => {
          const score = match.getResultScore(
            GroupOfMarket.SCORE,
            item.stage,
            '-:-'
          )?.split(':');
          return (
            <li key={i}>
              {item.title}
              <span>{score[0]}</span>
              <span>{score[1]}</span>
            </li>
          );
        })
      }
    </ul>
  );
}

export default BasketballResult;
