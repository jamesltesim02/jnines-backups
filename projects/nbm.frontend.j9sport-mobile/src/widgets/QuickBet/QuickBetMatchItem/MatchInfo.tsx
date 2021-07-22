import React from 'react';
import IconTeam from '../../../components/icons/IconTeam';
import MatchTime from '../../../components/match/MatchTime';
import Match from '../../../stores/matchs/Match';

function MatchInfo (
  {
    match
  }: {
    match: Match
  }
) {
  return (
    <ul className="j9s-quickbet-match-info">
      <li>
        <IconTeam
          src={match.teamLogo1}
          name={match.team1}
          size={40}
        />
        <label>{match.team1}</label>
      </li>
      <li>
        <h3>{match.tournamentName}</h3>
        <time><MatchTime match={match} /></time>
      </li>
      <li>
        <IconTeam
          src={match.teamLogo2}
          name={match.team2}
          size={40}
        />
        <label>{match.team2}</label>
      </li>
    </ul>
  );
}

export default MatchInfo;
