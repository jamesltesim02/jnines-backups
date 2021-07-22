import React from 'react';
import { Icon } from 'antd-mobile';

import { TourGroup } from '../../../stores/matchs/MatchList';
import Match from '../../../stores/matchs/Match';
import MatchItem from '../MatchItem';
import mergeClass from '../../../utils/mergeClass';
import FavoriteToggle from '../FavoriteToggle';
import { FavoriteType } from '../../../consts/match';
import { observer } from 'mobx-react';

export const TourHeader = observer((
  {
    tour,
    active,
  }: {
    tour: TourGroup,
    active: boolean
  }
) => {
  return (
    <header
      className={mergeClass({
        'tour-header': true,
        active
      })}
    >
      <div>
        <label className="text-ellipsis">
          {tour.tournamentName}
        </label>
        <FavoriteToggle
          targetId={tour.tournamentId}
          type={FavoriteType.TOURNAMENT}
        />
      </div>
      <Icon
        type="down"
        size="xs"
      />
    </header>
  );
})

export const TourContent = observer((
  { tour }: { tour: TourGroup }
) => {
  if (!tour.matchs?.length) {
    return <></>;
  }
  return (
    <>
      {
        tour.matchs.map(
          (match: Match) => (
            <MatchItem
              key={match.matchId}
              match={match}
            />
          )
        )
      }
    </>
  );
})
