import React from 'react';
import { useApi } from '../../apis';
import Pull from '../../apis/Pull';
import { MatchState, Sports, StateExtra } from '../../consts/match';
import TabMenu from '../common/TabMenu';

const CountMap: any = {
  [MatchState.LIVE]: 'live',
  [MatchState.TODAY]: 'today',
  [MatchState.EARLY]: 'early',
  [StateExtra.COMBO]: 'combo'
};
const STATES = [
  StateExtra.SUGGEST,
  MatchState.LIVE,
  MatchState.TODAY,
  MatchState.EARLY,
  StateExtra.COMBO,
  StateExtra.RESULT,
];

function StateBar (
  {
    active,
    sportId,
    onChange = () => {},
  }: {
    active?: number,
    sportId: Sports,
    onChange: (sid: number) => void
  }
) {
  const { pull }: { pull: Pull } = useApi({ pull: Pull });
  const [counts, setCounts] = React.useState<Record<string, number>>({});

  React.useEffect(
    () => {
      pull.getCountsOfSport(sportId)
        .then(setCounts)
    },
    [pull, sportId, active]
  );

  return (
    <TabMenu
      tabs={STATES.map(state => ({
        value: state,
        labelKey: `filter.state_${state}`,
        tip: counts[CountMap[state]]
      }))}
      active={active}
      onChange={onChange}
    />
  );
}

export default StateBar;
