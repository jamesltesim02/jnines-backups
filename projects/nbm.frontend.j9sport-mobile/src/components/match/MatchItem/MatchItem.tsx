import { observer } from 'mobx-react';
import React from 'react';
import Match from '../../../stores/matchs/Match';
import MatchInfo from './MatchInfo';
import MatchMarkets from './MatchMarkets';

function MatchItem (
  { match }: {
    match: Match
  }
) {
  return (
    <div className="match-item">
      <MatchInfo match={match} />
      <MatchMarkets match={match} />
    </div>
  );
}

export default observer(MatchItem);
