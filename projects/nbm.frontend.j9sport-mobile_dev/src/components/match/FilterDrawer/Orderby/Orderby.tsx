import React from 'react';
import { MatchOrderby, MatchState } from '../../../../consts/match';
import { MatchFilter } from '../../MatchHooks';

import M from '../../../common/m';
import FilterBlock from '../FilterBlock';

function OrderBy (
  {
    filter,
    onChange
  }: {
    filter: MatchFilter,
    onChange: (newFilter: any) => void
  }
) {
  const items = (
    filter.matchState === MatchState.LIVE ? [
      MatchOrderby.BY_TIME_DESC,
      MatchOrderby.BY_TOUR
    ] : [
      MatchOrderby.BY_TIME_ASC,
      MatchOrderby.BY_TOUR
    ]
  );
  return (
    <FilterBlock
      title={<M id="filter.orderby_title" />}
      className="orderby-filter"
    >
      <ul>
        {
          items.map(item => (
            <li
              key={item}
              className={
                filter.orderBy === item
                ? 'active'
                : undefined
              }
            >
              <label><M id={`filter.orderby_${item}`} /></label>
              <button onClick={() => onChange({ orderBy: item })}>
                <i className="radio" />
              </button>
            </li>
          ))
        }
      </ul>
    </FilterBlock>
  );
}

export default OrderBy;
