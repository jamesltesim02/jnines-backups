import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircleOutlined, RightOutlined } from '@ant-design/icons';

import { withApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import BlockHeader from '../../common/BlockHeader';

import matchStore from '../../../stores/matchs';
import { observer } from 'mobx-react';
import Video from '../DetailContent/InfoBox/MediaBox/Video';
import { IconSport } from '../../icons';
import MatchTime from '../MatchTime';
import M from '../../common/m';

const LIST_STORE_KEY = 'recommend_live';

function RecommendLive (
  {
    api: { pull }
  }: {
    api: { pull: Pull }
  }
) {
  const [current, setCurrent] = React.useState(-1);
  React.useEffect(
    () => {
      pull.getRecommendLives().then(
        list => {
          if (!list) {
            return;
          }
          matchStore.setData({ [LIST_STORE_KEY]: list });
          setCurrent(0);
        }
      );

      return () => matchStore.clear(LIST_STORE_KEY);
    },
    [pull]
  );

  const list = matchStore.list(LIST_STORE_KEY);

  if (!list?.length || current === -1) {
    return null;
  }

  return (
    <section className="recommend-live">
      <BlockHeader
        titleKey="match.live_block_title"
        extras={
          <Link to={`/detail/${list[current]?.matchId}`}>
            <M id="match.to_detail" />
            <RightOutlined />
          </Link>
        }
      />
      <div className="current-video">
        <Video
          resource={list[current].videoSrc as string}
          muted
        />
      </div>
      <div className="matchs">
        {
          list.map((match, index) => (
            <button
              key={match.matchId}
              className={index === current ? 'active' : ''}
              onClick={() => setCurrent(index)}
            >
              <div>
                <IconSport type={match.sportId} />
                <time><MatchTime match={match} /></time>
                <span>{match.tournamentName}</span>
              </div>
              <div>
                <var>[{match.score?.join(':')}]</var>
                <label>{match.matchName}</label>
              </div>
              <PlayCircleOutlined />
            </button>
          ))
        }
      </div>
    </section>
  );
}

export default withApi({ pull: Pull })(
  observer(RecommendLive)
);
