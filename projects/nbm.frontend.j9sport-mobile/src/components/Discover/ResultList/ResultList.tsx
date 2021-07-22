import { Accordion } from 'antd-mobile';
import React from 'react';
import { useApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import { Sports } from '../../../consts/match';

import M from '../../common/m';
import Match from '../../../stores/matchs/Match';
import EmptyList from '../../common/EmptyList';
import LoadingBar from '../../common/LoadingBar';
import { TourHeader } from '../../match/TourItem';
import ResultItem from './ResultItem';

type Tournament = {
  key: string,
  sportId: Sports,
  tournamentId: string,
  tournamentName: string,
  matchs: any[]
}

function ResultTours (
  {
    tours
  } : {
    tours: Tournament[]
  }
) {
  // 展开的联赛列表
  const [active, setActive] = React.useState<Array<string>>(
    tours.map(g => g.tournamentId)
  );
  React.useEffect(
    () => {
      setActive(tours.map(g => g.tournamentId))
    },
    [tours]
  );

  return (
    // 手风琴容器
    <Accordion
      activeKey={active}
      onChange={setActive}
      className="match-list"
    >
      {
        tours.map(tour => (
          // 手风琴项
          <Accordion.Panel
            key={tour.tournamentId}
            header={
              <TourHeader
                tour={tour}
                active={active.includes(tour.key)}
              />
            }
          >
            {
              tour.matchs.map(match => (
                <ResultItem
                  key={match.matchId}
                  match={new Match(match)}
                />
              ))
            }
          </Accordion.Panel>
        ))
      }
    </Accordion>
  );
}

function ResultList (
  {
    filter: {
      sportId,
      dateTime: matchDay,
      tourIds
    }
  } : {
    filter: any
  }
) {
  const { pull }: { pull: Pull } = useApi({ pull: Pull})

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);
  const [tours, setTours] = React.useState<Tournament[]>([]);

  React.useEffect(
    () => {
      setLoading(true);
      pull.getMatchResults({
        sportId,
        matchDay
      }).then(results => {
        setList(results);
      }).finally(
        () => setLoading(false)
      );
    },
    [pull, sportId, matchDay]
  );

  React.useEffect(
    () => {
      const groups: Tournament[] = [];
      list.forEach(match => {
        if (tourIds?.length > 0 && !tourIds.includes(match.tournamentId)) {
          return;
        }
        let group: Tournament | undefined = groups.find(
          (group: Tournament) => (group.tournamentId === match.tournamentId)
        );
        if (!group) {
          group = {
            key: match.tournamentId,
            sportId: match.sportId,
            tournamentId: match.tournamentId as string,
            tournamentName: match.tournamentName,
            matchs: []
          };
          groups.push(group);
        }
        group.matchs.push(match)
      });

      setTours(groups);
    },
    [list, tourIds]
  );


  return (
    <>
    <div className="reesult-list-tips">* <M id="pages.result_tips" /></div>
    {
      tours?.length
      ? <ResultTours key={sportId} tours={tours} />
      : (
        <div className="scrollable-match-list fullscreen">
          {
            loading
            ? <LoadingBar className="full" />
            : <EmptyList />
          }
        </div>
      )
    }
    </>
  );
}

export default ResultList;
