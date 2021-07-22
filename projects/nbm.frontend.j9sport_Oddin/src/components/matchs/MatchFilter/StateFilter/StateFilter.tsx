import React from 'react';

import { MatchState, StateExtra } from '../../../../consts/match';

import { withApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';

import FilterItem from '../FilterItem';

const CountMap: any = {
  [MatchState.LIVE]: 'live',
  [MatchState.TODAY]: 'today',
  [MatchState.EARLY]: 'early',
  [StateExtra.COMBO]: 'combo'
};

const items = [
  StateExtra.SUGGEST,
  MatchState.LIVE,
  MatchState.TODAY,
  MatchState.EARLY,
  StateExtra.COMBO,
  StateExtra.RESULT,
  StateExtra.LIVE_LIST
];

function StateFilter (
  {
    api: { pull },
    sportId,
    checked,
    onChange = () => {}
  }: {
    sportId: number,
    api: { pull: Pull },
    checked: number,
    onChange: (state: number) => void,
  }
) {
  const [counts, setCounts] = React.useState<Record<string, number>>({});

  React.useEffect(
    () => {
      pull.getCountsOfSport(sportId)
        .then(setCounts)
    },
    [pull, sportId]
  );

  return (
    <FilterItem
      labelKey="filter.state"
      checked={[checked]}
      items={
        items.map(value => ({
          value,
          textKey: `filter.state_${value}`,
          count: counts[CountMap[value]]
        }))
      }
      onChange={(newSates: number[]) => onChange(newSates[0])}
      className="state-filter"
    />
  );
}

export default withApi({ pull: Pull })(StateFilter);
