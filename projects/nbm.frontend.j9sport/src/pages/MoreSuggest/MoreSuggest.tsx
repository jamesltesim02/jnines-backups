import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Sports, SportType } from '../../consts/match';
import { withApi } from '../../apis';
import Pull from '../../apis/Pull';

import matchStore from '../../stores/matchs';

import BlockHeader from '../../components/common/BlockHeader';
import MatchTime from '../../components/matchs/MatchTime';
import IconTeam from '../../components/icons/IconTeam';

const LIST_STORE_KEY = 'more_suggest';

function MoreSuggest(
  {
    api: { pull },
    sportId = Sports.SOCCER
  }: {
    api: { pull: Pull },
    sportId?: SportType
  }
) {

  React.useEffect(
    () => {
      pull.getComingSoon(sportId).then(
        result => matchStore.setData({ [LIST_STORE_KEY]: result })
      );

      return () => matchStore.clear(LIST_STORE_KEY);
    },
    [pull, sportId]
  );

  const matchList = matchStore.list(LIST_STORE_KEY);

  if (!matchList?.length) {
    return null;
  }

  return (
    <section className="more-suggest">
      <BlockHeader
        titleKey="pages.soon_list"
      />
      <div className="list">
        {
          matchList.map(match => (
            <Link
              key={match.matchId}
              to={`/detail/${match.matchId}`}
            >
              <div className="team">
                <IconTeam
                  src={match.teamLogo1}
                  name={match.team1}
                  size={40}
                />
                <label>{match.team1}</label>
              </div>
              <div>
                <label>{match.tournamentName}</label>
                <time><MatchTime match={match} /></time>
                <span>VS</span>
              </div>
              <div className="team">
                <IconTeam
                  src={match.teamLogo2}
                  name={match.team2}
                  size={40}
                />
                <label>{match.team2}</label>
              </div>
            </Link>
          ))
        }
      </div>
    </section>
  );
}

export default withApi({ pull: Pull })(
  observer(MoreSuggest)
);

