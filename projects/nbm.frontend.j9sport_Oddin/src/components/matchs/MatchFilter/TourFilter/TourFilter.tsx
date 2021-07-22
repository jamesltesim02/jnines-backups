import React from 'react'

import { withApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';
import { MatchState } from '../../../../consts/match';
import FilterItem from '../FilterItem';

/* eslint-disable react-hooks/exhaustive-deps */
function TourFilter (
  {
    api: { pull },
    sportId,
    matchState,
    dateTime,
    checked = [],
    defaultTours,
    onChange = () => {}
  }: {
    api: { pull: Pull },
    sportId?: number,
    matchState?: number,
    dateTime: string,
    defaultTours?: Array<{ value: string, text: string, count: number }>,
    checked?: Array<string>,
    onChange: (values: Array<string>) => void
  }
) {
  const [items, setItems] = React.useState<any>([]);
  const [params, setParams] = React.useState<any>(null);

  React.useEffect(
    () => {
      const params: any = {
        sportId,
        matchState,
      };
      if (Boolean(dateTime)) {
        if (matchState === MatchState.TODAY) {
          params.filterDate = dateTime;
        } else {
          params.matchDay = dateTime;
        }
      }

      setParams(params);
    },
    [sportId, matchState, dateTime]
  );

  React.useEffect(
    () => {
      if (defaultTours) {
        setItems(defaultTours);
        return;
      }

      if (!params) {
        return;
      }

      pull.getTours(params).then(
        result => {
          setItems(
            result.map(
              (t: any) => ({
                value: t.tourId,
                text: t.tourName,
                count: t.matchCount
              })
            )
          );
        }
      ).finally(
        () => onChange([])
      );
    },
    [pull, params, defaultTours]
  );

  if (!items.length) {
    return null;
  }

  return (
    <FilterItem
      labelKey="filter.tours"
      checked={checked}
      items={items}
      onChange={onChange}
      className="tour-filter"
      emptyAllItem
      multiple
    />
  );
}

export default withApi({ pull: Pull })(TourFilter);