import React from 'react';
import { Link } from 'react-router-dom';
import { FavoriteType } from '../../../consts/match';
import Match from '../../../stores/matchs/Match';
import IconFlash from '../../icons/IconFlash';
import IconRedEvelope from '../../icons/IconRedEnvelope';
import IconTeam from '../../icons/IconTeam';
import IconVideo from '../../icons/IconVideo';
import FavoriteToggle from '../FavoriteToggle';
import MatchTime from '../MatchTime';

import appStore from '../../../stores/app';
import M from '../../common/m'
import { observer } from 'mobx-react';

function MatchInfo (
  {
    match,
    tinified = false
  }: {
    match: Match
    tinified?: boolean
  }
) {
  const content = (
    <>
      <FavoriteToggle
        targetId={match.matchId}
        type={FavoriteType.MATCH}
      />
      <section>
        <div className="time">
          <time>
            <MatchTime match={match} />
          </time>
        </div>
        <div className="team">
          <IconTeam
            src={match.logo1}
            name={match.team1}
            size={14}
          />
          <label>{match.team1}</label>
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
        </div>
        <div className="team">
          <IconTeam
            src={match.logo2}
            name={match.team2}
            size={14}
          />
          <label>{match.team2}</label>
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
        </div>
      </section>
      {
        tinified ? null : (
          <footer>
            <div className="icons">
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
            </div>
            <div className="more">
              <span><M id="match.more_plays" /></span>
              <var>{match.matchMarket}+</var>
            </div>
          </footer>
        )
      }
    </>
  );
  return (
    <>
    {
      tinified ? (
        <div className="match-info tinified">{content}</div>
      ) : (
        <Link
          to={`${appStore.combo ? '/parlay' : ''}/detail/${match.matchId}`}
          className="match-info"
        >
          {content}
        </Link>
      )
    }
    </>
    
  );
}

export default observer(MatchInfo);
