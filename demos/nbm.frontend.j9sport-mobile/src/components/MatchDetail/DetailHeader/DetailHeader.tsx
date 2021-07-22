import React from 'react';
import { FavoriteType } from '../../../consts/match';
import Match from '../../../stores/matchs/Match';
import BackButton from '../../common/BackButton';
import IconFilter from '../../icons/IconFilter';
import FavoriteToggle from '../../match/FavoriteToggle';

import M from '../../common/m'

function DetailHeader (
  {
    match,
    onRecommendOpen
  }: {
    match?: Match,
    onRecommendOpen?: () => void
  }
) {
  return (
    <header className="detail-header dark">
      <BackButton />
      <label className="text-ellipsis">
        {match?.tournamentName || <M id="match.match_detail" />}
      </label>
      {
        match ? (
          <FavoriteToggle
            targetId={match.matchId}
            type={FavoriteType.MATCH}
          />
        ) : null
      }
      <button onClick={onRecommendOpen}>
        <IconFilter />
      </button>
    </header>
  );
}

export default DetailHeader;
