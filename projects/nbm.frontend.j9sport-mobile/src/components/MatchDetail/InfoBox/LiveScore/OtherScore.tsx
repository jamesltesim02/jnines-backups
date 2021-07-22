import { observer } from 'mobx-react';
import React from 'react';
import Match from '../../../../stores/matchs/Match';

import M from '../../../common/m';

function OtherScore (
  { match }: {
    match: Match
  }
) {
  return (
    <ul className="other-score">
    {
      match.gameScore.map((item, index) => (
        <li
          key={index}
          className="score"
        >
          <label>
            <M
              id="match.sets_index"
              values={{ index: index + 1 }}
            />
          </label>
          <div>{item[0] || 0}</div>
          <div>{item[1] || 0}</div>
        </li>
      ))
    }
  </ul>
  );
}

export default observer(OtherScore);
