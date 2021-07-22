import React from 'react';
import Match from '../../../stores/matchs/Match';
import MatchInfo from './MatchInfo';
import BetPane from './BetPane';

function QuickBetMatchItem (
  {
    match
  }: {
    match: Match
  }
) {
  if (!match) {
    return null;
  }
  return (
    <div className="j9s-quickbet-match-item">
      <MatchInfo match={match} />
      <BetPane match={match} />
    </div>
  );
}

export default QuickBetMatchItem;
