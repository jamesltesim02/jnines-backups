import React from 'react';
import { observer } from 'mobx-react';

import mergeClass from '../../../utils/mergeClass';
import { FavoriteType } from '../../../consts/match';

import matchStore from '../../../stores/matchs';
import Match from '../../../stores/matchs/Match';

import FavoriteButton from '../FavoriteButton';
import MatchTime from '../MatchTime';
import MatchVersus from './MatchVersus';

function Info (
  {
    match,
    main = false,
    onClick = () => {}
  }: {
    match: Match,
    main: boolean,
    onClick?: any
  }
) {
  return (
    <section
      className="list-match-info"
      onClick={onClick}
    >
      {
        main ? (
          <>
            <div>
              <div className="tour">
                <label>
                  <i style={{ backgroundColor: matchStore.tourColor(match.tournamentId) }} />
                  {match.tournamentName}
                </label>
                <FavoriteButton
                  targetId={match.tournamentId}
                  type={FavoriteType.TOURNAMENT}
                />
              </div>
              <div
                className={
                  mergeClass({
                    time: true,
                    live: match.isLive
                  })
                }
              >
                <MatchTime match={match} />
              </div>
            </div>
            <MatchVersus
              match={match}
              scoreVisisble={main}
            />
          </>
        ) : (
          <>
            <div></div>
            <div></div>
          </>
        )
      }
    </section>
  );
}

export default observer(Info);
