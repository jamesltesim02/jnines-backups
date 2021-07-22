import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';
import EmptyList from '../../../../components/common/EmptyList';
import LoadingBar from '../../../../components/common/LoadingBar';
import TabMenu from '../../../../components/common/TabMenu';
import DiscoverHeader from '../../../../components/Discover/DiscoverHeader';
import IconTeam from '../../../../components/icons/IconTeam';
import { useMatchFilter } from '../../../../components/match/MatchHooks';
import MatchTime from '../../../../components/match/MatchTime';
import { AVAILABLE_SPORTS, Sports, StateExtra } from '../../../../consts/match';
import { ResourceDir } from '../../../../consts/network';
import Match from '../../../../stores/matchs/Match';
import mergeClass from '../../../../utils/mergeClass';

const tabs = AVAILABLE_SPORTS.map(value => ({
  value,
  labelKey: `sports.${value}`
}))

function StreamItem (
  {
    index,
    match
  }: {
    index: number,
    match: Match
  }
) {
  return (
    <Link
      to={`/detail/${match.matchId}`}
      className={mergeClass(
        'stream-item',
        `match-${match.sportId}-${index % 5 + 1}`
      )}
    >
      <header>
        <IconTeam
          src={match.tournamentLogo}
          type={ResourceDir.TOURNAMENT}
          name={match.tournamentName}
          size={15}
        />
        <label>{match.tournamentName}</label>
        <time><MatchTime match={match} /></time>
      </header>
      <ul>
        <li>
          <IconTeam
            src={match.logo1}
            type={ResourceDir.COMPETITOR}
            name={match.team1}
            size={40}
          />
          <label>{match.team1}</label>
        </li>
        <li>
          <button />
          <div>
            {
              match.isLive ? (
                <>
                  <var>{match.score[0]}</var>
                  <var>{match.score[1]}</var>
                </>
              ) : null
            }
          </div>
        </li>
        <li>
          <IconTeam
            src={match.logo2}
            type={ResourceDir.COMPETITOR}
            name={match.team2}
            size={40}
          />
          <label>{match.team2}</label>
        </li>
      </ul>
    </Link>
  );
}

function StreamsPage () {
  const { pull }: { pull: Pull } = useApi({ pull: Pull });

  const [filter, setFilter] = useMatchFilter({
    sportId: Sports.SOCCER,
    matchState: StateExtra.LIVE_LIST,
    dateTime: dayjs().format('YYYYMMDD'),
    tourIds: []
  });
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState<any[]>([]);
  // const [touredList, setTourList] = React.useState<any[]>([]);

  React.useEffect(
    () => {
      setLoading(true);
      setList([]);
      const timer = setTimeout(
        () => {
          pull.getLiveList({
            sportId: filter.sportId,
            matchDay: filter.dateTime
          }).then(results => {
            setList(results);
          }).finally(
            () => setLoading(false)
          )
        },
        100
      );
      return () => clearTimeout(timer);
    },
    [pull, filter.sportId, filter.dateTime]
  );

  const touredList = (
    list.length ? (
      filter.tourIds?.length ? (
        list.filter(item => filter.tourIds?.includes(item.tournamentId))
      ) : list
    ) : []
  )

  return (
    <>
      <DiscoverHeader
        filter={filter}
        onFilterChange={newFilter => setFilter(filter, newFilter)}
        filtable
      />
      <TabMenu
        tabs={tabs}
        active={filter.sportId}
        onChange={sportId => setFilter(filter, ({ sportId }))}
      />
      {
        touredList.length ? (
          <div className="stream-list">
          {
            touredList.map((match, index) => (
              <StreamItem
                key={match.matchId}
                index={index}
                match={new Match(match)}
              />
            ))
          }
          </div>
        ) : (
          <div className="scrollable-match-list fullscreen">
            {
              loading
              ? <LoadingBar className="full"/>
              : <EmptyList />
            }
          </div>
        )
      }
    </>
  );
}

export default StreamsPage;
