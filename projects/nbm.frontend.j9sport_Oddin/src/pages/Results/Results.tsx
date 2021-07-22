import dayjs from 'dayjs';
import React from 'react';
import SubPage from '../../components/common/SubPage';
import MatchFilter from '../../components/matchs/MatchFilter';
import MatchList from '../../components/matchs/MatchList';
import { Sports } from '../../consts/match';

function Results (
  {
    matchState
  }: {
    matchState: number
  }
) {
  const [filter, setFilter] = React.useState<any>({
    sportId: Sports.SOCCER,
    matchState,
    dateTime: dayjs().format('YYYYMMDD')
  });

  React.useEffect(
    () => {
      setFilter({
        sportId: Sports.SOCCER,
        matchState,
        dateTime: dayjs().format('YYYYMMDD')
      });
    },
    [matchState]
  );

  return (
    <SubPage>
      <MatchList
        filter={
          <MatchFilter
            checked={filter}
            onChange={setFilter}
            sportable
            dateable
          />
        }
        params={filter}
      />
    </SubPage>
  );
}

export default Results;
