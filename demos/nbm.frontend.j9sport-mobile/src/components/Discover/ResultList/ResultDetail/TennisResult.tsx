import React from 'react';
import fill from 'lodash/fill';
import Match from '../../../../stores/matchs/Match';

import M from '../../../common/m';

function TennisResult (
  { match }: {
    match: Match
  }
) {
  const sets = match.gameScore.reduce(
    (previous, curr) => (
      [
        (
          (+previous[0] || 0)
          +
          (+curr[0] || 0)
        ),
        (
          (+previous[1] || 0)
          +
          (+curr[1] || 0)
        )
      ]
    ),
    [0, 0]
  );

  const score = match.liveScore.score.split(':');
  const gameScore: Array<any> = (
    match.gameScore.length
    ? match.gameScore
    : fill(new Array(5), null)
  )

  return (
    <ul className="tennis-result">
      {
        gameScore.map((score: any, index) => (
          <li key={index}>
            <label>Q{index + 1}</label>
            <span>
              {
                (
                  !score
                  ||
                  Math.max(...score) === 0
                ) ? '-' : score[0]
              }
            </span>
            <span>
              {
                (
                  !score
                  ||
                  Math.max(...score) === 0
                ) ? '-' : score[1]
              }
            </span>
          </li>
        ))
      }
      <li key="sets">
        <label><M id="match.games" /></label>
        <span>{sets[0]}</span>
        <span>{sets[1]}</span>
      </li>
      <li key="score">
        <label><M id="match.sets" /></label>
        <span>{score[0]}</span>
        <span>{score[1]}</span>
      </li>
    </ul>
  );
}

export default TennisResult;
