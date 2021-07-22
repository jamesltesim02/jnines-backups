import { observer } from 'mobx-react';
import React from 'react';

import { FavoriteType } from '../../../../consts/match';

import Match from '../../../../stores/matchs/Match';

import IconFlash from '../../../icons/IconFlash';
import IconVideo from '../../../icons/IconVideo';

import FavoriteButton from '../../FavoriteButton';
import MatchTime from '../../MatchTime';
import IconTeam from '../../../icons/IconTeam';
import IconRedEvelope from '../../../icons/icon-red-envelope';

function MatchVersus (
  {
    match,
    scoreVisisble = true,
    timeVisible = false,
  }: {
    match: Match,
    scoreVisisble?: boolean,
    timeVisible?: boolean
  }
) {
  return (
    <div className="list-versus">
      <div className="team">
        <IconTeam
          src={match.teamLogo1}
          name={match.team1}
          size={16}
        />
        <label>{match.team1}</label>
        {
          scoreVisisble ? (
            <>
            {
              (
                match.redCard
                &&
                Number(match.redCard[0]) > 0
              ) ? (
                <span className="red-card">
                  {match.redCard[0]}
                </span>
              ) : null
            }
            {
              (match.score) ? (
                <span className="score">
                  {match.score[0] || 0}
                </span>
              ) : null
            }
            </>
          ) : null
        }
        
      </div>
      <div className="team">
        <IconTeam
          src={match.teamLogo2}
          name={match.team2}
          size={16}
        />
        <label>{match.team2}</label>
        {
          scoreVisisble ? (
            <>
            {
              (
                match.redCard
                &&
                Number(match.redCard[1]) > 0
              ) ? (
                <span className="red-card">
                  {match.redCard[1]}
                </span>
              ) : null
            }
            {
              (match.score) ? (
                <span className="score">
                  {match.score[1] || 0}
                </span>
              ) : null
            }
            </>
          ) : null
        }
      </div>
      {
        scoreVisisble ? (
          <div className="ops">
            {
              timeVisible ? (
                <div className="time">
                  <MatchTime match={match} />
                </div>
              ) : null
            }
            {
              match.activityInfo ? (
                <IconRedEvelope playing={match.activityInfo.show} />
              ) : null
            }
            {
              Boolean(match.nanoId)
              ? (<IconVideo />)
              : null
            }
            {
              Boolean(match.lmtId)
              ? (<IconFlash />)
              : null
            }
            <FavoriteButton
              targetId={match.matchId}
              type={FavoriteType.MATCH}
            />
          </div>
        ) : null
      }
    </div>
  );
}

export default observer(MatchVersus);
