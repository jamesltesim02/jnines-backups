import React from 'react';
import { useParams } from 'react-router-dom';
import MatchsPageHeader from '../../components/match/MatchsPageHeader';
import StateBar from '../../components/match/StateBar';
import { useMatchList, useMatchFilter } from '../../components/match/MatchHooks';
import { MatchOrderby, MatchState, StateExtra } from '../../consts/match';
import ScrollableMatchList from '../../components/match/ScrollableMatchList';
import ResultList from '../../components/Discover/ResultList';

/* eslint-disable react-hooks/exhaustive-deps */
function SportPageContent (
  { sportId }: { sportId: number }
) {
  // 查询条件
  const [filter, setFilter] = useMatchFilter({
    sportId,
    matchState: StateExtra.SUGGEST,
    orderBy: MatchOrderby.BY_TIME_ASC
  });

  // 查询比赛列表
  const result = useMatchList('sport-list', filter);

  React.useEffect(
    () => {
      if (sportId === filter.sportId) {
        return;
      }
      setFilter(
        filter,
        {
          sportId,
          matchState: StateExtra.SUGGEST
        }
      );
    },
    [sportId, setFilter]
  );

  return (
    <>
      <MatchsPageHeader
        sport={sportId}
        filter={filter}
        onFilterChange={(newFilter: any) => setFilter(filter, newFilter)}
        filtable={
          filter.matchState !== StateExtra.SUGGEST
        }
        switchable
        backable
      />
      <StateBar
        active={filter.matchState}
        sportId={filter.sportId}
        onChange={matchState => {
          const newFilter: any = {
            matchState,
            pageIndex: 1,
            tourIds: [],
            dateTime: undefined
          };
          if (
            filter.matchState !== MatchState.LIVE
            &&
            matchState === MatchState.LIVE
          ) {
            newFilter.orderBy = MatchOrderby.BY_TOUR
          }
          if (
            filter.matchState === MatchState.LIVE
            &&
            matchState !== MatchState.LIVE
          ) {
            newFilter.orderBy = MatchOrderby.BY_TIME_ASC
          }

          setFilter(
            filter,
            newFilter
          )
        }}
      />
      {
        filter.matchState === StateExtra.RESULT ? (
          <ResultList filter={filter} />
        ) : (
          <ScrollableMatchList
            result={result}
            onLoadmore={
              pageIndex => setFilter(
                filter,
                { ...filter, pageIndex }
              )
            }
            className="fullscreen"
          />
        )
      }
    </>
  );
}

function SportPage () {
  const params: any = useParams();
  const sportId = Number(params.sid);
  return (
    <SportPageContent
      key={sportId}
      sportId={sportId}
    />
  );
}

export default SportPage;
