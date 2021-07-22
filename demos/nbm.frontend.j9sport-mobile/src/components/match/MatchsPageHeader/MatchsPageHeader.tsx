import { Icon } from 'antd-mobile';
import React from 'react';
import mergeClass from '../../../utils/mergeClass';

import BackButton from '../../common/BackButton';
import M from '../../common/m';
import { SportMenu } from '../../home/SportNav/SportNav';

import IconFilter from '../../icons/IconFilter';
import FilterDrawer from '../FilterDrawer';
import { MatchFilter } from '../MatchHooks';
import { TourFilterItem } from '../FilterDrawer/TourFilter/TourFilter';
import SearchButton from '../../common/SearchButton';

function MatchsPageHeader (
  {
    sport,
    filter,
    backable = false,
    switchable = false,
    filtable = true,
    tours,
    onBack,
    onFilterChange
  }: {
    backable?: boolean,
    switchable?: boolean,
    filtable?: boolean,
    sport: any,
    filter: MatchFilter,
    tours?: Array<TourFilterItem>,
    onFilterChange: (newFilter: any) => void,
    onBack?: () => boolean | undefined
  }
) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);

  React.useEffect(
    () => {
      document.body.style.overflow = (
        menuOpen || filterOpen
        ? 'hidden'
        : ''
      );
    },
    [menuOpen, filterOpen]
  );

  return (
    <>
      <header className="matchs-page-header dark">
        {
          backable
          ? <BackButton onBack={onBack}/>
          : null
        }
        <button
          className="sport-swither"
          onClick={
            switchable
            ? () => setMenuOpen(true)
            : undefined
          }
        >
          <M id={`sports.${sport}`} />
          {
            switchable ? (
              <Icon
                type="down"
                size="xxs"
              />
            ) : null
          }
        </button>
        <div className="opers">
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
        </div>
      </header>
      <SportMenu
        open={menuOpen}
        active={sport}
        onClose={() => setMenuOpen(false)}
      />
      <FilterDrawer
        open={filterOpen}
        filter={filter}
        tours={tours}
        onClose={() => setFilterOpen(false)}
        onChange={onFilterChange}
      />
    </>
  );
}

export default MatchsPageHeader;
