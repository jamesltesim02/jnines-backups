import React from 'react';
import { useParams } from 'react-router-dom';

import MatchFilter from '../../../components/matchs/MatchFilter';
import MatchList from '../../../components/matchs/MatchList';
import { StateExtra } from '../../../consts/match';
import dayjs from 'dayjs';

function SportPage () {
  const sportId: any = +useParams<any>().sport;

  const [filter, setFilter] = React.useState<any>({
    sportId,
    matchState: StateExtra.SUGGEST
  });

  const handleFilterChange = (newFilter: any) => {
    if (
      (
        StateExtra.RESULT !== newFilter.matchState
        &&
        StateExtra.LIVE_LIST !== newFilter.matchState
      )
      ||
      filter.matchState === newFilter.matchState
    ) {
      setFilter(newFilter);
      return;
    }

    setFilter({
      ...newFilter,
      dateTime: dayjs().format('YYYYMMDD')
    });
  };

  React.useEffect(
    () => {
      setFilter({
        sportId,
        matchState: StateExtra.SUGGEST
      })
    },
    [sportId]
  );

  return (
    <MatchList
      filter={
        <MatchFilter
          checked={filter}
          onChange={handleFilterChange}
          statable
          dateable
        />
      }
      params={filter}
    />
  )
}

export default SportPage;
