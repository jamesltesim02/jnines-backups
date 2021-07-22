import React from 'react';

import { AVAILABLE_SPORTS, MatchState, Sports } from '../../../consts/match';

import MatchList from '../../../components/matchs/MatchList';
import MatchFilter from '../../../components/matchs/MatchFilter';
import useSportsCount from '../../../components/matchs/hooks/useSportsCount';
import { observer } from 'mobx-react';
import LoadingBar from '../../../components/common/LoadingBar';

function InplayPage () {
  const counts = useSportsCount('inplay', true);
  const [filter, setFilter] = React.useState<any>(null);

  React.useEffect(
    () => {
      if (
        !Object.keys(counts).length
        ||
        filter?.sportId
      ) {
        return;
      }
      const sportId = (
        AVAILABLE_SPORTS.find(
          sid => counts[sid] > 0
        ) || Sports.SOCCER
      )
      setFilter({
        sportId,
        matchState: MatchState.LIVE
      });
    },
    [counts, filter]
  );

  if (!filter) {
    return <LoadingBar />;
  }

  return (
    <MatchList
      filter={
        <MatchFilter
          checked={filter}
          onChange={setFilter}
          sportCounts={counts}
          sportable
        />
      }
      params={filter}
    />
  )
}

export default observer(InplayPage);

