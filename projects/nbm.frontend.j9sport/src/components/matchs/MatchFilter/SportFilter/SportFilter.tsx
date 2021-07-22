import React from 'react';

import { AVAILABLE_SPORTS } from '../../../../consts/match';

import FilterItem from '../FilterItem';

function SportFilter (
  {
    checked,
    sportCounts = {},
    onChange = () => {}
  }: {
    checked?: number,
    sportCounts?: any,
    onChange: (sportId: number) => void
  }
) {

  return (
    <FilterItem
      labelKey="filter.sports"
      checked={[checked]}
      items={
        AVAILABLE_SPORTS.map(value => ({
          value,
          textKey: `sports.${value}`,
          count: sportCounts[value]
        }))
      }
      onChange={(newSports: number[]) => onChange(newSports[0])}
      className="sport-filter"
    />
  );
}

export default SportFilter;
