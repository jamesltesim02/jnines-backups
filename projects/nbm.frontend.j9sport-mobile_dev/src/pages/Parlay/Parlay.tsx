import React from 'react';
import MatchsPageHeader from '../../components/match/MatchsPageHeader';
import SportsBar from '../../components/match/SportsBar';
import { useMatchList, useMatchFilter } from '../../components/match/MatchHooks';
import { ExtraMenu, Sports, StateExtra } from '../../consts/match';

import ScrollableMatchList from '../../components/match/ScrollableMatchList';

function Parlay () {
  const [filter, setFilter] = useMatchFilter({
    sportId: Sports.SOCCER,
    matchState: StateExtra.COMBO
  });
  const result = useMatchList('parlay-list', filter);

  return (
    <>
      <MatchsPageHeader
        sport={ExtraMenu.PARLAY}
        onFilterChange={newFilter => setFilter(filter, newFilter)}
        filter={filter}
        backable
        switchable
      />
      <SportsBar
        active={filter.sportId}
        type={ExtraMenu.PARLAY}
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

export default Parlay;
