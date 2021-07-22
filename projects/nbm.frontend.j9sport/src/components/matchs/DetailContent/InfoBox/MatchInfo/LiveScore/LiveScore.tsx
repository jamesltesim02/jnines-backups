import React from 'react';
import Match from '../../../../../../stores/matchs/Match';

import { Sports } from '../../../../../../consts/match';

import SoccerScore from './SoccerScore';
import BasketballScore from './BasketballScore';
import TennisScore from './TennisScore';
import OtherScore from './OtherScore';
import { observer } from 'mobx-react';

const SCORES: any = {
  [Sports.SOCCER]: SoccerScore,
  [Sports.BASKETBALL]: BasketballScore,
  [Sports.TENNIS]: TennisScore,
};

function LiveScore (
  { match }: {
    match: Match
  }
) {
  const SportScore = (
    SCORES[match.sportId]
    ||
    OtherScore
  );

  if (
    !SportScore
    ||
    match.sportId === Sports.ESPORTS
  ) {
    return null;
  }

  return (
    <div className="live-score">
      <SportScore match={match} />
    </div>
  );
}

export default observer(LiveScore);
