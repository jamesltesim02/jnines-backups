import { fromPairs } from 'lodash';
import React from 'react';
import { useApi } from '../../apis';
import Pull from '../../apis/Pull';
import { ExtraMenu, Sports } from '../../consts/match';
import TabMenu from '../common/TabMenu';

const SPORTS = [
  Sports.SOCCER,
  Sports.BASKETBALL,
  Sports.ESPORTS,
  Sports.TENNIS,
  Sports.VOLLEYBALL,
  Sports.TABLETENNIS,
  Sports.ICEHOCKEY,
  Sports.BASEBALL
];

function SportsBar (
  {
    active,
    type,
    counts: initCounts,
    onChange = () => {},
  }: {
    active: Sports,
    type: number,
    counts?: any,
    onChange: (sid: Sports) => void
  }
) {
  const { pull }: { pull: Pull } = useApi({ pull: Pull });
  const [counts, setCounts] = React.useState<any>(initCounts);

  React.useEffect(
    () => {
      if (
        ![
          ExtraMenu.INPLAY,
          ExtraMenu.PARLAY
        ].includes(type)
      ) {
        return;
      }

      const apis: any = {
        [ExtraMenu.INPLAY]: pull.getInplaySportsCount.bind(pull),
        [ExtraMenu.PARLAY]: pull.getComboSportsCount.bind(pull),
      };

      apis[type]().then(
        (result: any) => setCounts(
          fromPairs(result.map((item: any) => ([item.sportId, item.count])))
        )
      )
    },
    [pull, type, active, setCounts]
  );

  React.useEffect(
    () => {
      if (initCounts) {
        setCounts(initCounts);
      }
    },
    [initCounts]
  );

  return (
    <TabMenu
      tabs={SPORTS.map(sid => ({
        value: sid,
        labelKey: `sports.${sid}`,
        tip: counts ? counts[sid] : undefined
      }))}
      active={active}
      onChange={onChange}
    />
  );
}

export default SportsBar;
