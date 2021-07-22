import React from 'react';
import {observer} from 'mobx-react';
import {Collapse, Tabs} from 'antd';
import SimpleBar from "simplebar-react";

import Match from '../../../stores/matchs/Match';
import MatchVersus from '../MatchItem/MatchVersus';
import {Link} from 'react-router-dom';
import M from '../../common/m';

const {TabPane} = Tabs;
const {Panel} = Collapse;

const MatchsByTour = observer(function (
  {
    list = [],
    combo
  }: {
    list: Array<Match>,
    combo: boolean
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
                      to={`/detail${combo ? '/99' : ''}/${match.matchId}`}
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
    live,
    combo
  }: {
    favorites?: Array<Match> | undefined | null,
    recommend?: Array<Match> | undefined | null,
    live?: Array<Match> | undefined | null,
    combo: boolean
  }
) {
  return (
    <SimpleBar className="detail-recommend">
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
              <MatchsByTour
                list={favorites}
                combo={combo}
              />
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
              <MatchsByTour
                list={recommend}
                combo={combo}
              />
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
              <MatchsByTour
                list={live}
                combo={combo}
              />
            </TabPane> : null
        }
      </Tabs>
    </SimpleBar>
  );
}

export default observer(DetailRecommend);
