import React from 'react';
import Match from '../../../stores/matchs/Match';
import BetPane from './BetPane';
import MatchInfo from './MatchInfo';

function QuickMatchItem (
  {
    match
  }: {
    match: Match
  }
) {
  return (
    <div className="j9s-quickbet-match-item">
      <MatchInfo match={match} />
      <BetPane match={match} />
    </div>
  );
}

export default QuickMatchItem;
