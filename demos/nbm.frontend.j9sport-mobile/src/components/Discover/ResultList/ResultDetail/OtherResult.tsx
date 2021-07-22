import React from 'react';
import Match from '../../../../stores/matchs/Match';

import M from '../../../common/m';

function OtherResult (
  { match }: {
    match: Match
  }
) {
  
  const score = match.liveScore.score.split(':');

  return (
    <ul className="other-result">
      <li>
        <label><M id="match.result_scores" /></label>
        <span>{score[0]}</span>
        <span>{score[1]}</span>
      </li>
    </ul>
  );
}

export default OtherResult;
