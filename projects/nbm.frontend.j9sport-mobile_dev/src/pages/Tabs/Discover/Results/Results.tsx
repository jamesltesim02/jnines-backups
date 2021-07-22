import dayjs from 'dayjs';
import React from 'react';
import DiscoverHeader from '../../../../components/Discover/DiscoverHeader';
import ResultList from '../../../../components/Discover/ResultList';
import { useMatchFilter } from '../../../../components/match/MatchHooks';
import SportsBar from '../../../../components/match/SportsBar';
import { Sports, StateExtra } from '../../../../consts/match';

function ResultsPage () {
  const [filter, setFilter] = useMatchFilter({
    sportId: Sports.SOCCER,
    matchState: StateExtra.RESULT,
    dateTime: dayjs().format('YYYYMMDD'),
    tourIds: []
  });
  return (
    <>
      <DiscoverHeader
        filter={filter}
        onFilterChange={newFilter => setFilter(filter, newFilter)}
        filtable
      />
      <SportsBar
        active={filter.sportId}
        type={StateExtra.RESULT}
        onChange={sportId => setFilter(filter, { sportId })}
      />
      <ResultList
        key={filter.sportId}
        filter={filter}
      />
    </>
  );
}

export default ResultsPage;
