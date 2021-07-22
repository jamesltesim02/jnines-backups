import React from 'react';
import { observer } from 'mobx-react';

import { Sports, StateExtra } from '../../../consts/match';

import MatchList from '../../../components/matchs/MatchList';
import MatchFilter from '../../../components/matchs/MatchFilter';
import useSportsCount from '../../../components/matchs/hooks/useSportsCount';

import cartStore, { TAB_INDEX } from '../../../stores/cart/Cart';

function ParleyPage () {
  const counts = useSportsCount('combo', true);

  const [filter, setFilter] = React.useState<any>({
    sportId: Sports.SOCCER,
    matchState: StateExtra.COMBO
  });

  const handleChange = (newFilter: any) => {
    if (newFilter.sportId !== filter.sportId) {
      newFilter.dateTime = undefined;
    }
    setFilter(newFilter);
  };

  React.useEffect(
    () => {
      cartStore.cartToggleTo(TAB_INDEX.COMBO);
      return () => cartStore.cartToggleTo(TAB_INDEX.SINGLE);
    },
    []
  );

  return (
    <MatchList
      filter={
        <MatchFilter
          checked={filter}
          onChange={handleChange}
          sportCounts={counts}
          sportable
          dateable
        />
      }
      params={filter}
    />
  );
}

export default observer(ParleyPage);
