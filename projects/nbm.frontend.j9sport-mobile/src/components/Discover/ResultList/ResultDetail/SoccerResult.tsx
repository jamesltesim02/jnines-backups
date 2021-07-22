import React from 'react';
import { GroupOfMarket, MarketStage } from '../../../../consts/match';
import Match from '../../../../stores/matchs/Match';
import M from '../../../common/m'

const scores = [
  // 上半场角球
  {
    group: GroupOfMarket.CORNER,
    stage: MarketStage.H1,
    title: (
      <label>
        <M id="scores.corner_h" />
        <i><M id="scores.h1_h" /></i>
      </label>
    )
  },
  // 上半场比分
  {
    group: GroupOfMarket.SCORE,
    stage: MarketStage.H1,
    title: (
      <label>
        <M id="scores.score_h" />
        <i><M id="scores.h1_h" /></i>
      </label>
    )
  },
  // 全场角球
  {
    group: GroupOfMarket.CORNER,
    stage: MarketStage.H0,
    title: (
      <label>
        <M id="scores.corner_h" />
        <i><M id="scores.h0_h" /></i>
      </label>
    )
  },
  // 全场比分
  {
    group: GroupOfMarket.SCORE,
    stage: MarketStage.H0,
    title: (
      <label>
        <M id="scores.score_h" />
        <i><M id="scores.h0_h" /></i>
      </label>
    )
  }
]

function SoccerResult (
  { match }: {
    match: Match
  }
) {

  return (
    <ul className="soccer-result">  
      {
        scores.map((item, i) => {
          const score = match.getResultScore(item.group, item.stage, '-:-')?.split(':')
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

export default SoccerResult;
