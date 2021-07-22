import React from 'react';
import { Link } from 'react-router-dom';
import Match from '../../../stores/matchs/Match';

import appStore from '../../../stores/app';
import IconTeam from '../../icons/IconTeam';
import MatchTime from '../../match/MatchTime';

import M from '../../common/m'

function RecommendMatchItem (
  { match }: {
    match: Match
  }
) {
  return (
    <Link
      to={`${appStore.combo ? '/parlay' : ''}/detail/${match.matchId}`}
      className="recommend-match-item"
      replace
    >
      <section className="team">
        <IconTeam
          src={match.logo1}
          name={match.team1}
          size={40}
        />
        <label>{match.team1}</label>
      </section>
      <section className="score">
        <time>
          <MatchTime match={match} />
        </time>
        {
          match.isLive ? (
            <div>
              <var>{match.score[0]}</var>
              <var>{match.score[1]}</var>
            </div>
          ) : (
            <span>VS</span>
          )
        }
        <label><M id="match.more_plays" /> <b>+{match.matchMarket}</b></label>
      </section>
      <section className="team">
        <IconTeam
          src={match.logo2}
          name={match.team2}
          size={40}
        />
        <label>{match.team2}</label>
      </section>
    </Link>
  );
}

export default RecommendMatchItem;
