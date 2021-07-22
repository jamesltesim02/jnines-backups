import React from 'react';
import Match from '../../../../stores/matchs/Match';

import M from '../../../common/m';

function Title () {
  return (
    <div className="score-title">
      <label><M id="match.result_scores" /></label>
    </div>
  );
}

function Item (
  { match }: {
    match: Match
  }
) {

  const score = match.liveScore.score.split(':');

  return (
    <ul className="score-item">
      <li key="score">
        <span>{score[0]}</span>
        <span>{score[1]}</span>
      </li>
    </ul>
  );
}

export default { Title, Item };