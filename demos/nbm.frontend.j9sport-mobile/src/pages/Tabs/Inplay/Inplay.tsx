import React from 'react';
import MatchsPageHeader from '../../../components/match/MatchsPageHeader';
import SportsBar from '../../../components/match/SportsBar';
import { useMatchList, useMatchFilter } from '../../../components/match/MatchHooks';
import { ExtraMenu, MatchOrderby, MatchState, Sports } from '../../../consts/match';

import ScrollableMatchList from '../../../components/match/ScrollableMatchList';

function Inplay () {
  const [filter, setFilter] = useMatchFilter({
    sportId: Sports.SOCCER,
    matchState: MatchState.LIVE,
    orderBy:  MatchOrderby.BY_TOUR

  });
  const result = useMatchList('inplay-list', filter);

  return (
    <>
      <MatchsPageHeader
        sport={ExtraMenu.INPLAY}
        onFilterChange={newFilter => setFilter(filter, newFilter)}
        filter={filter}
        switchable
      />
      <SportsBar
        type={ExtraMenu.INPLAY}
        active={filter.sportId}
        onChange={
          sportId => setFilter(
            filter,
            {
              sportId,
              pageIndex: 1,
              tourIds: [],
              dateTime: undefined
            }
          )
        }
      />
      <ScrollableMatchList
        result={result}
        onLoadmore={
          pageIndex => setFilter(filter, { pageIndex })
        }
        className="fullscreen"
      />
    </>
  );
}

export default Inplay;
