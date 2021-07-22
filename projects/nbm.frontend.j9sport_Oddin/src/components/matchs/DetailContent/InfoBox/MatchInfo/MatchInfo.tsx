import React from 'react';
import { observer } from 'mobx-react';

import { FavoriteType } from '../../../../../consts/match';
import mergeClass from '../../../../../utils/mergeClass';

import memberStore from '../../../../../stores/member';
import Match from '../../../../../stores/matchs/Match';

import { IconSport } from '../../../../icons';

import FavoriteButton from '../../../FavoriteButton';
import MatchTime from '../../../MatchTime';
import LiveScore from './LiveScore';
import IconTeam from '../../../../icons/IconTeam';

import M from '../../../../common/m';

function MatchInfo (
  { match }: {
    match: Match
  }
) {
  const favorited = memberStore.isFavorited(match.matchId, FavoriteType.MATCH);

  return (
    <section
      className={mergeClass({
        'detail-match-info': true,
        [`sport-${match.sportId}`]: true,
        'live': match.isLive
      })}
    >
      <div className="container">
        <header className="tour">
          <IconSport type={match.sportId} />
          {match.tournamentName}
        </header>
        <ul className="versus">
          <li className="team">
            <IconTeam
              src={match.teamLogo1}
              name={match.team1}
              size={50}
            />
            <label>{match.team1}</label>
          </li>
          <li>
            {
              match.isLive ? (
                <div className="score">
                  {match.score[0]}
                  <span>:</span>
                  {match.score[1]}
                </div>
              ) : (
                <div className="score">VS</div>
              )
            }
            <div className="time">
              <MatchTime match={match} />
            </div>
          </li>
          <li className="team">
            <IconTeam
              src={match.teamLogo2}
              name={match.team2}
              size={50}
            />
            <label>{match.team2}</label>
          </li>
        </ul>
        {
          match.isLive ? (
            <LiveScore match={match} />
          ) : null
        }
      </div>
      <FavoriteButton
        targetId={match.matchId}
        label={
          <M id={`match.${favorited ? 'favorited' : 'add_favorite'}`} />
        }
        type={FavoriteType.MATCH}
      />
    </section>
  );
}

export default observer(MatchInfo);
