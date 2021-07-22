import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import mergeClass from '../../../utils/mergeClass';
import SearchButton from '../../common/SearchButton';
import IconFilter from '../../icons/IconFilter';
import FilterDrawer from '../../match/FilterDrawer';
import { TourFilterItem } from '../../match/FilterDrawer/TourFilter/TourFilter';
import { MatchFilter } from '../../match/MatchHooks';

import M from '../../common/m'

const DISCOVER_TABS = [
  {
    label: <M id="discover_tabs.promo" />,
    path: '/tab/discover/promotions'
  },
  {
    label: <M id="discover_tabs.live" />,
    path: '/tab/discover/streams'
  },
  {
    label: <M id="discover_tabs.match_result" />,
    path: '/tab/discover/results'
  },
];

function DiscoverHeader (
  {
    filtable = false,
    filter,
    tours,
    onFilterChange
  }: {
    filtable?: boolean,
    filter?: MatchFilter,
    tours?: Array<TourFilterItem>,
    onFilterChange?: (newFilter: any) => void,
  }
) {
  const location = useLocation();
  const [filterOpen, setFilterOpen] = React.useState(false);
  React.useEffect(
    () => {
      document.body.style.overflow = filterOpen ? 'hidden' : '';
    },
    [filterOpen]
  );
  return (
    <header className="discover-header horizontal-scrollable dark">
      <section
        className="tabs"
      >
        <div>
          {
            DISCOVER_TABS.map(tab => (
              <Link
                key={tab.path}
                to={tab.path}
                replace
                className={
                  location.pathname === tab.path ? 'active' : undefined
                }
              >{tab.label}</Link>
            ))
          }
        </div>
      </section>
      <SearchButton />
      <button
        className={mergeClass({
          'filter-button': true,
          active: filtable
        })}
        onClick={() => setFilterOpen(true)}
      >
        <IconFilter/>
      </button>
      <FilterDrawer
        open={filterOpen}
        filter={filter}
        tours={tours}
        onClose={() => setFilterOpen(false)}
        onChange={onFilterChange}
        />
    </header>
  );
}

export default DiscoverHeader;
