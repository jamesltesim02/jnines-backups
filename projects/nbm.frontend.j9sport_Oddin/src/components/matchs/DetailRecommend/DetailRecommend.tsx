import React from 'react';
import {observer} from 'mobx-react';
import {Collapse, Tabs} from 'antd';

import Match from '../../../stores/matchs/Match';
import MatchVersus from '../MatchItem/MatchVersus';
import {Link} from 'react-router-dom';
import M from '../../common/m';

const {TabPane} = Tabs;
const {Panel} = Collapse;

const MatchsByTour = observer(function (
  {
    list = []
  }: {
    list: Array<Match>
  }
): any {
  const [active, setActive] = React.useState<any>([]);
  const [tours, setTours] = React.useState<Array<Array<Match>>>([]);

  React.useEffect(
    () => {
      const groups: Array<Array<Match>> = [];
      list.forEach(match => {
        let group = groups.find(
          g => g[0].tournamentId === match.tournamentId
        );
        if (group) {
          group.push(match);
          return;
        }
        group = [match];
        groups.push(group);
      });

      setTours(groups);
      setActive(groups.map(g => g[0].tournamentId));
    },
    [list]
  );


  return (
    <Collapse
      activeKey={active}
      expandIconPosition="right"
      onChange={setActive}
    >
      {
        tours.map(
          (tour) => (
            <Panel
              key={tour[0].tournamentId}
              header={<label>{tour[0].tournamentName}</label>}
            >
              {
                tour.map(
                  match => (
                    <Link
                      key={match.matchId}
                      className="recommend-item"
                      to={`/detail/${match.matchId}`}
                      replace
                    >
                      <MatchVersus
                        match={match}
                        timeVisible
                      />
                    </Link>
                  )
                )
              }
            </Panel>
          )
        )
      }
    </Collapse>
  );
});

function DetailRecommend(
  {
    favorites,
    recommend,
    live
  }: {
    favorites?: Array<Match> | undefined | null,
    recommend?: Array<Match> | undefined | null,
    live?: Array<Match> | undefined | null,
  }
) {
  return (
    <section className="detail-recommend">
      <Tabs
        size="small"
      >
        {
          favorites
          &&
          favorites.length > 0 ?
            <TabPane
              key="fav"
              tab={<M id="sports.-1"/>}
            >
              <MatchsByTour list={favorites}/>
            </TabPane> : null
        }
        {
          recommend
          &&
          recommend.length > 0 ?
            <TabPane
              key="recommend"
              tab={<M id="match.recommend"/>}
            >
              <MatchsByTour list={recommend}/>
            </TabPane> : null
        }
        {
          live
          &&
          live.length > 0 ?
            <TabPane
              key="live"
              tab={<M id="match.live"/>}
            >
              <MatchsByTour list={live}/>
            </TabPane> : null
        }
      </Tabs>
    </section>
  );
}

export default observer(DetailRecommend);
