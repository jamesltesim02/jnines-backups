import React from 'react';
import Match from '../../../stores/matchs/Match';
import IconTeam from '../../icons/IconTeam';
import MatchTime from '../../match/MatchTime';
import ItemContainer from './ItemContainer';
import images from './images';
import LiveScore from './LiveScore';
import { MediaType } from '../../../consts/match';
import IconFlash from '../../icons/IconFlash';
import IconVideo from '../../icons/IconVideo';
import { observer } from 'mobx-react';

const MEDIA_ICONS: any = {
  [MediaType.LMT]: <IconFlash />,
  [MediaType.VIDEO]: <IconVideo />
};

function DetailInfo (
  {
    match,
    active,
    onActiveChange
  }: {
    match: Match,
    active: boolean,
    onActiveChange: (active: MediaType) => void
  }
) {
  return (
    <ItemContainer
      className="media-detail-info"
      active={active}
      style={{
        backgroundImage: `url(${images(`./${match.sportId}.png`)})`,
        gridTemplateRows: match.isLive ? '7fr 3fr' : '1fr'
      }}
    >
      <ul className="versus">
        <li className="team">
          <IconTeam
            src={match.logo1}
            name={match.team1}
            size={40}
          />
          <label>{match.team1}</label>
        </li>
        <li className="score">
          <time><MatchTime match={match} /></time>
          {
            match.isLive ? (
              <div className="inplay">
                <var>{match.score[0]}</var>
                <var>{match.score[1]}</var>
              </div>
            ) : (
              <div>VS</div>
            )
          }
          <section>
            {
              match.medias.map(type => (
                <button
                  key={type}
                  onClick={() => onActiveChange(type)}
                >{MEDIA_ICONS[type]}</button>
              ))
            }
          </section>
        </li>
        <li className="team">
          <IconTeam
            src={match.logo2}
            name={match.team2}
            size={40}
          />
          <label>{match.team2}</label>
        </li>
      </ul>
      {
        match.isLive ? (
          <LiveScore match={match} />
        ) : null
      }
    </ItemContainer>
  );
}

export default observer(DetailInfo);
