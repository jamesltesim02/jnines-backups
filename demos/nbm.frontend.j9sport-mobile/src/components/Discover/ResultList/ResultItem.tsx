import React from 'react';
import Match from '../../../stores/matchs/Match';
import MatchInfo from '../../match/MatchItem/MatchInfo';
import ResultDetail from './ResultDetail';

function ResultItem (
  {
    match
  }: {
    match: Match
  }
) {
  return (
    <section className="result-item">
      <MatchInfo
        match={match}
        tinified
      />
      <div className="result-container">
        <ResultDetail match={match} />
      </div>
    </section>
  );
}

export default ResultItem;
