import React from 'react';

import SoccerResult from './SoccerResult';
import BasketballResult from './BasketballResult';
import TennisResult from './TennisResult';
import OtherResult from './OtherResult';
import { Sports } from '../../../../consts/match';

const SPORTS_RESULT: Record<number, any> = {
  [Sports.SOCCER]: SoccerResult,
  [Sports.BASKETBALL]: BasketballResult,
  [Sports.TENNIS]: TennisResult
};

function ResultDetail (
  { match } : {
    match: any
  }
) {
  const ResultComponent = SPORTS_RESULT[match.sportId] || OtherResult;
  return (
    <ResultComponent match={match} />
  );
}

export default ResultDetail;
