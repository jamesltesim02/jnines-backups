import React from 'react';
import fill from 'lodash/fill';

import Match from '../../../../stores/matchs/Match';
import M from '../../../common/m';

function Title () {
  return (
    <div className="score-title">
      {
        [1, 2, 3, 4, 5].map(period => (
          <label key={period}>
            <M
              id={`period.${period}`}
              values={{ type: <M id="periods.11" /> }}
            />
          </label>
        ))
      }
      <label><M id="match.games" /></label>
      <label><M id="match.sets" /></label>
    </div>
  );
}

function Item (
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
    <ul className="score-item">
      {
        gameScore.map((score: any, index) => (
          <li key={index}>
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
        <span>{sets[0]}</span>
        <span>{sets[1]}</span>
      </li>
      <li key="score">
        <span>{score[0]}</span>
        <span>{score[1]}</span>
      </li>
    </ul>
  );
}

export default { Title, Item };